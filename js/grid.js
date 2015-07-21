$(document).ready(function(){
var cols, rows, colSize, cells, color,
    field = $('#field'),
    fWidth = field.width(),
    setBtn = $('#set'),
    resetBtn = $('#reset'),
    canvas = $('#canvas'),
    context = canvas[0].getContext('2d'),
    lineWidth = 1, 
    amp = 4,
    lineRound = true,
    save = $('#save'),
    imgInfo = $('#imgInfo'),
    sizeVal = $('#sizeLabelVal'),
    ampVal = $('#ampLabelVal'),
    addLayerBtn = $('#addLayer'),
    pHolder = $('#divPickerHolder'),
    pGreyIsh = $('#greyIsh'),
    doc = $(document),
    imageSV = $('#pickerBG'), 
    cursorSV = $('#pointerBG'), 
    imageH = $('#pickerColor'),
    cursorH = $('#pointerColor'), 
    imageSVwidth = imageSV.width(),
    imageSVheight = imageSV.height(),
    imageHheight = imageH.height(),
    colorSpot = $('.colorSpot'), 
    colorHash = $('.colorHash'),
    result = imageSV.css('background-color'),
    locHue = {x: 0, y: 0}, 
    locSaVa ={x: 0, y: imageSVheight}, 
    h = 0, s = 100, v =0, r=0, g=0, b=0, hex="000000", tempHash = hex;
    
window.mousedown = 0;
pHolder.css('display', 'none');  
    
/*  /////   GET X and Y   ///// */
      getXY = function(index){
        var x = index % cols; 
        return { x: x,
                 y: (index - x) / rows
        }
      };

    
/*  ////    GET Index   ///// */
      getIndex = function(x, y){
        return rows * y + x;
      };    

/* ///////  LINE CHECK   /////////// */
  checkLines = function(){
    var len = cols * rows,
        cell = layers[layers.length-1].cells, 
        i0=undefined,
        max1=max2=max3=max4=0;
      
    for(var i=0, l=len-1; i<l; i++){
      if (!cell[i]) continue;
      
      if (i0 == undefined){
          i0 = i;    
      } else {
        switch (i-i0){
          case (cols+1):
            max1 = (i > max1) ? lineCheck(cell, i0, i, len, cols+1) : max1;  
            break;
          case (cols-1):
            max2 = (i > max2) ? lineCheck(cell, i0, i, len, cols-1) : max2;
            break;
          case cols: 
            max3 = (i > max3) ? lineCheck(cell, i0, i, len, cols) : max3;
            break;
          case 1:
            max4 = (i > max4) ? lineCheck(cell, i0, i, len, 1) : max4;
            break;
          default:
            i0 = undefined; 
           // max1=max2=max3=max4=0;
          }
      }
    }  
  };
  
/* ////  line check ///// */
  function lineCheck(cell, i0, i, len, value){
    var lineLength = 2, lineXN = i,
        loc0 = getXY(i0), loc, 
        a = ((amp>0) ? amp : 1) * lineWidth,
        res = 0;
    for(var j=i+1; j<len; j++){
      if (!cell[j]) continue;
      if (j - lineXN == value){
          lineXN = j;
          lineLength++;
      }
    }
    if (lineLength > 2) {
            loc = getXY(lineXN);
            context.beginPath();
            context.moveTo(loc0.x * a, loc0.y * a);
            context.lineTo(loc.x * a, loc.y * a);
            context.stroke();
            console.log("A["+loc0.x*a + "; "+ loc0.y*a + "], B["+ loc.x * a + "; " + loc.y * a + "]");
            res = j;
        }
    return res;
  };
    
    
/* /////////    ADD LAYER   /////////*/
  addLayer = function(){
    //layers[layers.length-1].color = hex;
        //$('.f-col').removeClass('active').css('background-color', '#ffffff');
  };
    
    
/* render preview */
    renderPreview = function(){
      context.lineWidth = lineWidth;
      context.strokeStyle = context.fillStyle = "#" + hex;
      context.clearRect(0, 0, canvas.width(), canvas.height());
      var cell = layers[layers.length-1].cells,
          tmpx, tmpy, actives=0,
          a = ((amp>0) ? amp : 1) * lineWidth;    
        
      for(var i=0, len = cols * rows; i < len; i++){ 
        loc = getXY(i);
        tmpx = loc.x * a;
        tmpy = loc.y * a;
        if (cell[i]) {
          actives++;
          if (!lineRound) {
              
                
          } else {
            context.fillRect(tmpx, tmpy, lineWidth, lineWidth);
              //console.log("["+i+"]x: "+loc.x*a + ", y: "+loc.y*a);
          }
        } 
          
      }
      if (actives > 2) checkLines(); 
    };    
    
/* RENDER grid */
    renderGrid = function(){
      var html = '', i = 0;
      for (var r=0; r<rows; r++){
        html+='<div class="row">';  
        for(var c=0; c<cols; c++){
          html += '<div class="f-col" data-i="'+ i++ +'"><div class="cube"></div></div>';
        }
        html+='</div>';
      }
      field.html(html);
      cells = $('.f-col'); 
      cells.width(colSize); 
      cells.height(cells.width()+'px');
      layers[0] = Object.create(Layer).params();
    };
    
    
/* reset Output image */
    resetOutput = function(){
        var tmpAmp, tmpW, tmpH;
        
        amp = $('#line-amplifier').val();
        lineWidth = $('#line-size').val();
        tmpAmp = (amp > 0) ? lineWidth * amp : lineWidth;
        tmpW = ((cols - 1) * tmpAmp) + +lineWidth;
        tmpH = ((rows - 1) * tmpAmp) + +lineWidth;
        
        canvas.attr('width', tmpW +'px').attr('height', tmpH + 'px');
        canvas.height(canvas.width() / (cols / rows));   
        imgInfo.html("img " + canvas.attr('width') + " * " + canvas.attr('height') + "");
        sizeVal.html("size[" + lineWidth + "]");
        ampVal.html("amp[" + amp + "]");
        
        renderPreview();
    };

    
/* reset everything */
    resetBtn.on('click', function(){
        cols = +$('#cols').val();
        rows = +$('#rows').val();
        colSize = (100 / cols).toPrecision(7) + '%';
        renderGrid();
        /* toggle active on click */
        cells.on('click', function(e){
            var thisColor, thee = $(this);
            thee.toggleClass('active');
            thisColor = (thee.hasClass('active')) ? hex : "ffffff"; 
            thee.css('background-color', '#'+thisColor);
            layers[layers.length-1].cells[thee.data('i')] =  thee.hasClass('active');
            renderPreview();
        });
        
        resetOutput();
    });

/* on change amplitude value */
$('#line-amplifier').change(resetOutput);    
    
/* on change lineSize value */    
$('#line-size').change(resetOutput);        

/* /////    on click Add Layer  ////// */
  addLayerBtn.on('click', function(){
    layers[layers.length-1].color = hex;  
    console.log(layers[layers.length-1]);
  });
    
/* set default grid 3x3 */
    resetBtn.click();

    
/*	/////    WINDOW TO OBJECT	///// */
    wtc = function(obj, x, y) {
        var bbox = obj.getBoundingClientRect();
        return { x: x - bbox.left * (obj.width / bbox.width),
                y: y - bbox.top * (obj.height / bbox.height)
        };
    };

    /* /// Save button  /// */    
    save.on('click',function(){
        $.post("html/save.php", {
            data: canvas[0].toDataURL("image/png")
        }, function (file) {
            window.location.href =  "html/download.php?path=" + file
        });
    });
    
    /* return color */
    outData = function(H, S, V, R, G, B, Hex){
	h = H;   s = S;   v = V; 
    r = R;   g = G;   b = B; 
    hex = Hex;  
    switch (arguments.length){
        case 9:
            locSaVa.y = arguments[7];
            locSaVa.x = arguments[8];
            break;
        case 8:
            locHue.y = arguments[7];
            imageSV.css('background-color', '#'+hsv2rgb(h,100,100).hex);
            break;
        case 10:
            locHue.y = arguments[7];
            locSaVa.y = arguments[8];
            locSaVa.x = arguments[9];
    		imageSV.css('background-color', '#'+hsv2rgb(h,100,100).hex);
            break;
    }
	colorHash.val(hex);
    colorSpot.css('background-color', '#'+hex);
    cursorH.css({top: locHue.y+'px'});
    cursorSV.css('top', locSaVa.y + 'px').css('left', locSaVa.x + 'px');  
    color = "#"+hex;
};    
    
/* ///   HSV - TO - RGB      //// */
    hsv2rgb = function(h, s, v){
        var H, X, C, r=0, g=0, b=0, m, hex;
        C = v / 100 * s / 100;
        m = (v / 100) - C;
        H = h / 60;
        X = C * (1 - Math.abs(H % 2 - 1));
        if (H >= 0 && H < 1){
            r = C;	g = X;
        } else if (H >= 1 && H < 2) {
            r = X;	g = C;
        } else if (H >= 2 && H < 3) {
            g = C;	b = X;
        } else if (H >= 3 && H < 4) {
            g = X;  b = C;
        } else if (H >= 4 && H < 5) {
            r = X;	b = C;
        } else {
            r = C;	b = X;
        }
        r = Math.floor((r + m) * 255); 
        g = Math.floor((g + m) * 255);
        b = Math.floor((b + m) * 255);
        hex = (r * 65536 + g * 256 + b).toString(16,6);
        if(hex.length < 6)
           for(var i=0, l=6-hex.length; i<l; i++)
                hex = '0'+hex;

        return {
            r: r,
            g: g,
            b: b,
            hex: hex
        }
    };

    /*  /////     RGB - TO - HSV     /////  */    
    rgb2hvs = function(r, g, b, hex){
        var h, s, v, m, M, c, hy, sy, vx;
        r /= 255;
        g /= 255;
        b /= 255;
        M = Math.max(r, g, b);
        m = Math.min(r, g, b);
        c = M - m;
        if (c == 0) h = 0;
        else if (M == r) 
            h = (((g - b) / c) % 6) * 60;
        else if (M == g) 
            h = ((b - r) / c + 2) * 60;
        else 
            h = ((r - g) / c + 4) * 60;
        if (h < 0) 
            h += 360;
        v = M * 100;
        s = (!M) ? 0 : (c / M * 100);

        return {
            h: h.toFixed(0),
            s: s.toFixed(0),
            v: v.toFixed(0),
            hy: imageHheight - Math.floor(imageHheight * h / 360),
            sy: imageSVheight - Math.floor(imageSVheight * s / 100),
            vx: Math.floor(imageSVwidth * v / 100)
        }
    };
    
    
    /*  /////   DOWN     ////// */ 
    imageH.on('touchstart', function(e) { 
        e.preventDefault(e); 
        locHue = wtc(imageH[0],e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY); 
        downHue();
     });
     imageH.on('mousedown', function(e) { 	
        e.preventDefault(e); 
        locHue = wtc(imageH[0],e.clientX,e.clientY); 
        downHue();
     });
    downHue = function(){
        h = Math.floor((imageHheight - locHue.y) / imageHheight * 360);
        h = (h < 0) ? 0 : (h>=360) ? 359 : h;
        temp = hsv2rgb(h,s,v);
        outData(h, s, v, temp.r, temp.g, temp.b, temp.hex, locHue.y);
    }

    imageSV.on('touchstart', function(e) { 
        e.preventDefault(e); 
        locSaVa = wtc(imageSV[0],e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY); 
        downSaVa();
     });
    imageSV.on('mousedown', function(e) { 	
        e.preventDefault(e); 
        locSaVa = wtc(imageSV[0],e.clientX,e.clientY); 
        downSaVa();
     });
    downSaVa = function(){
        s = Math.floor((imageSVheight - locSaVa.y) / imageSVheight * 100);
        v = Math.floor(locSaVa.x / imageSVwidth * 100);
        s = (s < 0) ? 0 : (s>100) ? 100 : s;
        v = (v < 0) ? 0 : (v>100) ? 100 : v;
        temp = hsv2rgb(h, s, v);
        outData(h, s, v, temp.r, temp.g, temp.b, temp.hex, locSaVa.y, locSaVa.x);
    }



     /*  ///////   MOVE     /////// */ 
    imageH.on('touchmove', function(e) { 
        e.preventDefault(e); 
        locHue = wtc(imageH[0],e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY); 
        moveHue();
     });

    $(window).on('mousedown mouseup', function(e) {
        this.mousedown = (e.type === 'mousedown') ? 1 : 0;
    });    

    imageH.on('mousemove', function(e) { 	
        e.preventDefault(e); 
        locHue = (window.mousedown) ? wtc(imageH[0],e.clientX,e.clientY) : locHue; 
        moveHue();
     });

    moveHue = function(){
        h = Math.floor((imageHheight - locHue.y) / imageHheight * 360);
        h = (h < 0) ? 0 : (h>=360) ? 359 : h;
        temp = hsv2rgb(h,s,v);
        outData(h, s, v, temp.r, temp.g, temp.b, temp.hex, locHue.y);
    }

    imageSV.on('touchmove', function(e) { 
        e.preventDefault(e); 
        locSaVa = wtc(imageSV[0],e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY); 
        moveSaVa();
     });
    imageSV.on('mousemove', function(e) { 	
        e.preventDefault(e);
        locSaVa = (window.mousedown) ? wtc(imageSV[0],e.clientX,e.clientY) : locSaVa;
        moveSaVa();
     });
    moveSaVa = function(){
        s = Math.floor((imageSVheight - locSaVa.y) / imageSVheight * 100);
        v = Math.floor(locSaVa.x / imageSVwidth * 100);
        s = (s < 0) ? 0 : (s>100) ? 100 : s;
        v = (v < 0) ? 0 : (v>100) ? 100 : v;
        temp = hsv2rgb(h, s, v);
        outData(h, s, v, temp.r, temp.g, temp.b, temp.hex, locSaVa.y, locSaVa.x);
    } 

    /*  ////////   UP     /////// */ 
    imageH.on('touchend', function(e) { 
        e.preventDefault(e);
        tmpLocHue = 0;
     });

    imageSV.on('touchend', function(e) { 
        e.preventDefault(e);
        tmpLocSaVa = 0;
     });
    
    /*  HASH value change  */
    colorHash.blur(function(){
        var hex = $(this).val(),
            tmp;
        switch (hex.length){
            case 6:
                r = parseInt(hex.substr(0,2), 16);
                g = parseInt(hex.substr(2,2), 16);
                b = parseInt(hex.substr(4,2), 16);
                tmp = rgb2hvs(r, g, b, hex);
                outData(tmp.h, tmp.s, tmp.v, r, g, b, hex, tmp.hy, tmp.sy, tmp.vx);
                break;
            case 3:
                r = parseInt(hex.substr(0,1), 16);
                g = parseInt(hex.substr(1,1), 16);
                b = parseInt(hex.substr(2,1), 16);
                tmp = rgb2hvs(r, g, b, hex);
                outData(tmp.h, tmp.s, tmp.v, r, g, b, hex, tmp.hy, tmp.sy, tmp.vx);
                break;
        }
    });
    
     /* picker */
    $('#color').on('click', function(){
        pGreyIsh.height(doc.height());
        pGreyIsh.css('display', 'block');
        pHolder.css('display', 'block');
    });
    
    $('#btnOk').on('click', function(){
        pGreyIsh.css('display', 'none');
        pHolder.css('display', 'none');
        renderPreview();
        $('.active').css('background-color', '#' + hex);
    });  
});