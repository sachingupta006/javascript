  $(function() {

    // My form uses a textarea that has TinyMCE editor applied to it
    var saveTimePeriod = 10000;


	$(".save_button").click(function() 
	{			
        // save the contents of the editor instance to the underlying text area
		var ed = tinymce.activeEditor; 
		ed.save();
		var link = $(this).attr("href");
        var cur_elem = $(this);
        cur_elem.html('saving...');        
        cur_elem.addClass('unclickable');
       
		$.ajax({
		  type: "POST",
		  url: link,
          // I needed to exclude a hidden field named csrfmiddlwaretoken
          // if you don't have any such requirement
          // you can directly use $('#form").serialize()
		  data: $("#form :input[name!='csrfmiddlewaretoken']").serialize(),
		  dataType: 'json',
          success: function(){
              cur_elem.html('Save');
              cur_elem.removeClass('unclickable');
          }
		});

		return false;	
	});

    /* Makes the button unclickable when the form is being saved */
    $('a.unclickable').click(function(){
        return false;
    });

    /* Function to be called for saving the form 
     * Can't use isDirty for 2 reasons
     * First there are other fields in the form that maybe changed
     * Second once a change has been made the isDirty() function always remains true
     * will have to think of something other in future
     */

    function saveForm(){

        // save the contents of the editor instance
    	var ed = tinymce.activeEditor; 
	    ed.save();

		var save_link = $('.save_button'); 
        var link = save_link.attr("href");
           
        save_link.html('saving...');        
        save_link.addClass('unclickable');
       
		$.ajax({
		    type: "POST",
		    url: link,
		    data: $("#form :input[name!='csrfmiddlewaretoken']").serialize(),
		    dataType: 'json',
            success: function(){
                save_link.html('Save');
                save_link.removeClass('unclickable');
		});
    };

    var interval_id;

    // Starts the auto saving for the first time 
    $(document).ready(function(){
         interval_id = setInterval(saveForm, saveTimePeriod);
    });

    // Timer resumes when the window comes back in focus
    $(window).focus(function() {
        if (!interval_id)
            interval_id = setInterval(saveForm, saveTimePeriod);
    });

    // Whenever window goes out of focus the timer is cleared
    $(window).blur(function() {
        clearInterval(interval_id);
            interval_id = 0;
    });

    // Since TinyMCE editor opens in an iframe, only the above logic cannot be used to check
    // whether the page is in view or not. Because whenever the editor is focus the iframe is in focus
    // and as a result $(window) goes out of focus
    // Since tinyMCE editor does not provide anything like ed.onfocus() I had to write some other way to find 
    // whethet the iframe is in the focus
    
    $(window).load(function(){

       var ed = tinymce.activeEditor;

       // ed.getDoc() gets the iframe of the editor
       // contents() is used to refer to the contents of the iframe
       $(ed.getDoc()).contents().find('body').focus(function(){
           if (!interval_id)
                interval_id = setInterval(saveForm, saveTimePeriod);
       });       

       $(ed.getDoc()).contents().find('body').blur(function(){
             clearInterval(interval_id);
             interval_id = 0;
       });       
       
    });
    
  });
  
