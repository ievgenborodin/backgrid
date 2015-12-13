define(["jquery", "src/ui", "src/input"], function($, ui, Input){
  var Picker = function(){  
    var that = this,
        target, h, s, v, r, g, b, hex, locH={}, locSV={}, mousedown=0,
        darkness = $('#' + ui.darknessId),
        wrap = $('#' + ui.pickerWrapId),
        svImg = $('#' + ui.pickerSVId),
        svPointer = $('#' + ui.pickerSVPointerId),
        hImg = $('#' + ui.pickerHId),
        hPointer = $('#' + ui.pickerHPointerId),
        ok = $('#' + ui.pickerOkId),
        preview = $('#' + ui.pickerPreviewId),
        hash = $('#' + ui.pickerHashId),
        
        hMax = hImg.height(), 
        sMax = svImg.height(), 
        vMax = svImg.width(),
        
        /* input module */
        input = new Input({
          keys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                 'a', 'b', 'c', 'd', 'e', 'f']
        });
      
    function moveHuePointer(){
        var posHue = hMax - Math.floor(hMax * h / 360); 
        hPointer.css({ top: posHue + 'px' });  
    };
    function moveSaturationValuePointer(){
        var posValue = Math.floor(vMax * v / 100),
            posSaturation = sMax - Math.floor(sMax * s / 100);  
        svPointer.css('top', posSaturation + 'px')
                 .css('left', posValue + 'px');  
    }; 
    function moveBackPointers(){
        locH.y = hMax - (h / 360) * hMax;
        locSV.y = sMax - (s / 100) * sMax;
        locSV.x = (v / 100) * vMax;
    };  
    function areaEvent(element, loc, callback){
      element.on('touchstart touchmove mousedown mousemove', function(e) { 
 	      e.preventDefault(e);  
          switch (e.type){
            case 'mousedown':
              loc = getBoundingBox(element,e.clientX,e.clientY);
              callback(loc);
            case 'mousemove':
              if(mousedown){
                loc = getBoundingBox(element,e.clientX,e.clientY);  
                callback(loc);
              }
              break;
            case 'touchstart':
            case 'touchmove':
              var windowScroll = $(window).scrollTop();
              loc = getBoundingBox(element, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY - windowScroll);
              callback(loc);
          }
      });
    };  
    function getBoundingBox(element, x, y) {
        var bbox = element[0].getBoundingClientRect();
        return { x: x - bbox.left * (element[0].width / bbox.width),
                y: y - bbox.top * (element[0].height / bbox.height)
        };
    };    
    function eventOnHue(loc){
        h = that.getHue(hMax, loc);
        changeBackground(h);
        moveHuePointer();
        reCountRGBHex();
    };
    function eventOnSaturationValue(loc){
        s = that.getSaturation(sMax, loc);
        v = that.getValue(vMax, loc);
        moveSaturationValuePointer();
        reCountRGBHex();
    };
    function reCountRGBHex(){
        var temp = that.getRGB(h, s, v);
        r = temp.r;
        g = temp.g;
        b = temp.b;
        hex = that.getHex(r, g, b);
        preview.css('background-color', '#'+hex);
        hash[0].innerHTML = hex;
    };    
    function changeBackground(h){
        var tmpHex, 
            tmp = that.getRGB(h, 100, 100);
        tmpHex = that.getHex(tmp.r, tmp.g, tmp.b); 
        svImg.css('background-color', '#' + tmpHex);
    };  
      
    /* external */
    this.init = function(el, callback){
        var temp, color;
        wrap.css('display', 'block');
        darkness.css('display', 'block');
        target = el;
        color = target.css('background-color');
        preview.css('background-color', color);
        temp = color.slice(4,-1).split(',');
        r = +temp[0];
        g = +temp[1];
        b = +temp[2];
        hex = that.getHex(r,g,b);
        hash[0].innerHTML = hex;
        temp = that.getHSV(r,g,b);
        h = +temp.h;
        s = +temp.s;
        v = +temp.v; 
        changeBackground(h);
        moveHuePointer();
        moveSaturationValuePointer();
        moveBackPointers();
        $(window).on('mousedown mouseup', function(e) {
            mousedown = (e.type === 'mousedown') ? 1 : 0;
        });  
        areaEvent(hImg, locH, eventOnHue);
        areaEvent(svImg, locSV, eventOnSaturationValue);
        ok.on('click', function(e){
            wrap.css('display', 'none');
            darkness.css('display', 'none');
            target.css('background-color', '#' + hex);
            if (callback) callback();
        });
        hash.on('click', function(e){
            input.start($(this), that.typingHex);
        });
    };
    this.getHue = function(hMax, loc){
        var h = Math.floor((hMax - loc.y) / hMax * 360);
        h = (h < 0) ? 0 : (h>360) ? 360 : h;
        return h;
    };
    this.getSaturation = function(sMax, loc){
        var s = Math.floor((sMax - loc.y) / sMax * 100);
        s = (s < 0) ? 0 : (s>100) ? 100 : s;
        return s;
    };
    this.getValue= function(vMax, loc){
        var v = Math.floor(loc.x / vMax * 100);
        v = (v < 0) ? 0 : (v>100) ? 100 : v;
        return v;
    };
    this.getHex = function(r, g, b){
        var hexx = parseInt(r * 65536 + g * 256 + b).toString(16);
        if( hexx.length < 6 )
           for(i=0, l=6-hexx.length; i<l; i++)
                hexx = '0'+hexx;
        return hexx;
    };      
    this.getHSV = function(r, g, b){
        var h, s, v, max, c;
        r /= 255;
        g /= 255;
        b /= 255;
        max = Math.max(r, g, b);
        c = max - Math.min(r, g, b);
        if (c == 0) h = 0;
        else if (max == r) 
            h = (((g - b) / c) % 6) * 60;
        else if (max == g) 
            h = ((b - r) / c + 2) * 60;
        else 
            h = ((r - g) / c + 4) * 60;
        if (h < 0) 
            h += 360;
        v = max * 100;
        s = (!max) ? 0 : (c / max * 100);
        return {
            h: h.toFixed(0),
            s: s.toFixed(0),
            v: v.toFixed(0)
        }
    };  
    this.getRGB = function(h, s, v){
        var hh, X, C, r=0, g=0, b=0, m, hex;
        C = v / 100 * s / 100;
        hh = h / 60;
        X = C * (1 - Math.abs(hh % 2 - 1));
        if (hh >= 0 && hh < 1){
            r = C;	g = X;
        } else if (hh >= 1 && hh < 2) {
            r = X;	g = C;
        } else if (hh >= 2 && hh < 3) {
            g = C;	b = X;
        } else if (hh >= 3 && hh < 4) {
            g = X;  b = C;
        } else if (hh >= 4 && hh < 5) {
            r = X;	b = C;
        } else {
            r = C;	b = X;
        }
        m = (v / 100) - C;
        r = Math.floor((r + m) * 255); 
        g = Math.floor((g + m) * 255);
        b = Math.floor((b + m) * 255);
        return {
            r: r,
            g: g,
            b: b,
        }
    };  
    this.typingHex = function(){
        var newHash = hash[0].innerHTML, 
            length = newHash.length,
            tmp, m;
        if(length === 3 || length === 6){
            m = (length % 6 == 0) ? 2 : 1;
            r = parseInt(newHash.substring(0, m*1), 16);
            g = parseInt(newHash.substring(m*1,m*2), 16);
            b = parseInt(newHash.substring(m*2,m*3), 16);
            tmp = that.getHSV(r, g, b);
            h = tmp.h;
            s = tmp.s;
            v = tmp.v;
            hex = that.getHex(r, g, b);
            changeBackground(h);          
            moveHuePointer();
            moveSaturationValuePointer();
            moveBackPointers(); 
            preview.css('background-color', '#' + newHash);
        } 
    };
  };
    
  return Picker;
});