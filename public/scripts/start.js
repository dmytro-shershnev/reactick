function i18n (key) {
  return 'vaverka_' + key;
}

function jsxString() {
    return Array.prototype.join.call(arguments, 'jsx')
}

var CommentForm = React.createClass({
  render: function() {
    var firstName = 'test1';
    var condition = 'test2';
    var  lastName= '1';

      var obj = {editable: 13};

    /// acc-user-name.dust
    return (            <div>
        <div class="account-settings__value">
            {(firstName
            ? jsxString(firstName, lastName)
            : i18n('ACC0070')
            )}
        </div>
            {(obj.editable
                ?   <form class="account-settings__edit" data-module-type="FormBlocking">
                        <input type="hidden" name="birthday" value="{birthday}"/>
                        <input type="hidden" name="gender" value="{gender}"/>
                        <input class="account-settings__edit-txt" name="firstName" type="text" data-module-type="TextFieldPlaceholder" placeholder={i18n ('ACC0033')} value={i18n('ACC0033')} data-form-blocking="input"/>
                        <input class="account-settings__edit-txt" name="firstName" type="text" data-module-type="TextFieldPlaceholder" placeholder={i18n ('ACC0033')} value={firstName} data-form-blocking="input"/>
                        <input class="account-settings__edit-txt" name="lastName" type="text" data-module-type="TextFieldPlaceholder" placeholder={i18n ('ACC0034')} value={lastName} data-form-blocking="input"/>
                        <button class="button account-settings__save" data-form-blocking="button" type="submit">{i18n ("ACC0013")}</button>
                        <button class="button button_color_gray account-settings__cancel" type="button">{i18n ("ACC0015")}</button>
                    </form>
                    : <button class="account-settings__edit-btn">{i18n ("ACC0003")}</button>

                    )}
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
