var i18n = React.createClass({
  render: function() {
    return  <span>'i18n' + this.props.key</span>;
  }
});

var CommentForm = React.createClass({
  render: function() {
    var firstName = '1asd';

    return (
      <div>
        <i18n key={firstName}/>
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="<i18n key={firstName}/>" ref="author"/>
          <input type="text" placeholder="Comment text..." ref="text"/>
          <input type="submit" value="Post"/>
        </form>
      </div>
    );
  },

  handleSubmit: function (event) {
    event.preventDefault();

    var author = React.findDOMNode(this.refs.author);
    var text = React.findDOMNode(this.refs.text);

    if (!author.value.trim() || !text.value.trim()) {
      return;
    }

    this.props.onFormSubmit({author: author.value.trim(), text: text.value.trim()});

    author.value = '';
    text.value = '';
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return <Comment author={comment.author}>{comment.text}</Comment>;
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var converter = new Showdown.converter();
var Comment = React.createClass({
  render: function () {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (<div className="comment">
      <h2 className="commentAuthor">{this.props.author}</h2>
      <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
    </div>
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function () {
    return {data: []}
  },

  loadContentFormServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function () {
    this.loadContentFormServer();
    setInterval(this.loadContentFormServer, this.props.pollInterval)
  },

  render: function() {
    return (
      <div className="commentBox">
        <h1>CommentBox.</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onFormSubmit={this.handleCommentFormSubmit}/>
      </div>
    );
  },

  handleCommentFormSubmit: function (comment) {
    var commentsList = this.state.data;
    var newCommentsList = commentsList.concat([comment]);
    this.setState(newCommentsList);

    $.ajax({
      url: this.props.url,
      type: 'POST',
      data: comment,
      dataType: 'json',
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function () {
        console.error('POST exception');
      }
    });
  }
});

React.render(
  <CommentBox url="comments.json" pollInterval={4000}/>,
  document.getElementById('content')
);
