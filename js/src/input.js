define(["jquery"], function($) {
    var Input = function(cfg){
      var i, length, text = '', target, onTyping, keysHtml='',
          keySize, keyMargin,
          keys = cfg.keys || [],
          wrapId = cfg.wrapId || 'input-wrap',
          wrap = $('#' + wrapId), wrapWidth,
          buttonsId = cfg.buttonsId || 'input-buttons',
          buttonsWrap = $('#' + buttonsId)[0],
          buttonsWrapHtml = buttonsWrap.innerHTML, 
          keyClass = cfg.keyClass || 'bcol',
          marginLeft = cfg.margin || 4,
          inRow = cfg.inRow || 3, 
          backspaceId = 'input-backspace';
        
    /* create keys html */
    for (i=0, length=keys.length; i<length; i++){
      keysHtml += '<div class="' + keyClass + '"><span class="mtext">' + keys[i] + '</span></div>';
    }  
            
    /* count button size */  
    if (window.innerWidth <= 120){
        wrapWidth = window.innerWidth;
        fullWidth = true;
    }
    else wrapWidth = 120;  
      
    wrap.css('width', wrapWidth + 'px');
    keySize = (100 - ((inRow + 1) * marginLeft)) / inRow; 
    keySize *= wrapWidth * 0.01;
    keyMargin = wrapWidth * 0.01 * marginLeft;         
        
    /* start */
    this.start = function(el, callback){
        var element = el[0].getBoundingClientRect(),
            tmpLeft, ww = window.innerWidth,
            scrollTop = $(window).scrollTop(), fontSize;
        
        buttonsWrap.innerHTML = buttonsWrapHtml + keysHtml;  
          
        onTyping = (callback) ? callback : null;  
        text = el[0].innerHTML;
        if (target) target.css('text-decoration', 'none');
        target = el;
        target.css('text-decoration', 'underline');
          
        if (element.left + wrapWidth + 30 >= ww){
            tmpLeft = ww - 30 - wrapWidth;
        } else tmpLeft = element.left;
        
        /* close key */
        $('#input-done').on('click',function(e){
            wrap.css('display', 'none');
            target.css('text-decoration', 'none');
        });
        
        /* set backspace key */  
        $('#' + backspaceId)
        .css('height', keySize + 'px')
        .css('width', keySize * 2 + marginLeft  + 'px')
        .css('margin-left', keyMargin + 'px')
        .css('margin-top', keyMargin + 'px')
        .on('click', function(e){
            text = target[0].innerHTML;  
            if (text.length) text = text.slice(0,-1);
            target[0].innerHTML = text;
            if (onTyping) onTyping();
        });  

        /* set other keys */  
        $('.' + keyClass)
        .css('width', keySize+'px')
        .css('height', keySize + 'px')
        .css('margin-left', keyMargin + 'px')
        .css('margin-top', keyMargin + 'px')
        .on('click', function(e){
            text = target[0].innerHTML;
            text += $(this)[0].children[0].innerHTML;
            target[0].innerHTML = text;
            if (onTyping) onTyping();  
        });          

        fontSize = parseInt($('.mtext').css('font-size'));  
        $('.mtext').css('line-height', keySize / fontSize);    
          
        wrap.css('display', 'block').css('left', tmpLeft)
            .css('top', element.top + element.height + scrollTop);
      };
    };
   
    return Input;
});
