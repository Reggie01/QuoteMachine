$( document ).ready( function() {
    "use strict";

    var AjaxErrorHandler = ( function() {
        return {
            errorHandler: function( xhr, status, errorThrown ) {
                console.log( "Sorry, there was a problem!" );
                console.log( "Error: " + errorThrown );
                console.log( "Status: " + status );
                console.dir( xhr );
            },
            alwaysHandler: function( xhr, status ) {
                //console.log( xhr );
            }
        };
    })();

    var TweetModule = ( function( ajaxHandler ) {
        var _tweetButton = document.getElementById( 'tweet-button' );
        var _ajaxCall = function() {
            return $.ajax({
                url: "http://api.forismatic.com/api/1.0/",

                dataType: "jsonp",
                jsonpCallback: "callback",

                data: {
                    method: "getQuote",
                    format: "jsonp",
                    lang: "en",
                    jsonp: "callback"
                }
            });
        };
        function exists( author ) {
          return author ? true : false;
        }
        
        function getAuthor( fn, author ) {
          return fn( author ) ? "- " + author : "- Anonymous";
        }
        var _updateDom = function( response ) {
            $("#new-quote").text( response.quoteText );
            var authorQuote = getAuthor( exists, response.quoteAuthor );
            $("#author-quote").text( authorQuote ); 
            
           var newTweethref = _tweetButton.getAttribute( "href" ).replace(/&text=[^&]+/, "&text=" + encodeURIComponent( response.quoteText + authorQuote ));
           _tweetButton.setAttribute( "href", newTweethref );
        };

        return {
            getQuote: function postQuote() {
                _ajaxCall().
                done( _updateDom ).
                fail( ajaxHandler.errorHandler ).
                always( ajaxHandler.alwaysHandler );
            }
        };
    })( AjaxErrorHandler );

    TweetModule.getQuote();

    $( "#quote" ).click( function(e) {
        e.preventDefault();
        TweetModule.getQuote();
    });

});