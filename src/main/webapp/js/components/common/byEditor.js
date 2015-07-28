
var BYAdmin = BYAdmin || {};

BYAdmin.removeEditor = function(){
    var textAreas = $("textarea");
    for (var i = 0; i < textAreas.length; i++) {
        //Check if element already has editor enabled
        if (tinymce.get(textAreas[i].id))
            tinyMCE.execCommand("mceRemoveEditor", false, textAreas[i].id);
    }

    if(typeof(tinyMCE) !== 'undefined') {
        var length = tinyMCE.editors.length;
        for (var i=length; i>0; i--) {
            tinyMCE.editors[i-1].remove();
        };
    }
}

BYAdmin.addEditor = function(param){
    var textAreas = $("textarea");
    BYAdmin.removeEditor();
    tinymce.init({
        selector: "#"+param.editorTextArea,
        theme: "modern",
	    skin: 'light',
	    content_css : "css/tinyMce_custom.css",
	    statusbar: false,
	    menubar: false,
	    plugins: [
	              "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
	              "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
	              " emoticons textcolor paste autoresize "
	          ],
	          toolbar: "styleselect | bold italic | bullist numlist hr  | undo redo | link unlink emoticons image media  preview ",
	          setup : function(ed) {
	              ed.on('init', function (evt) {
	                  var toolbar = $(evt.target.editorContainer)
	                      .find('>.mce-container-body >.mce-toolbar-grp');
	                  var editor = $(evt.target.editorContainer)
	                      .find('>.mce-container-body >.mce-edit-area');

	                  // switch the order of the elements
	                  toolbar.detach().insertAfter(editor);
	                  var editor_content = $("#"+param.editorTextArea).val();
	                  ed.setContent(editor_content);
	              });
	              ed.on("keyup", function () {
	                  var id = ed.id;
	                  if ($.trim(ed.getContent({format: 'text'})).length) {
	                      $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
	                  } else {
	                      $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
	                  }
	              });

	          }
    });

}


