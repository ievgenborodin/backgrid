var layers = [];
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
    tool,
    activeTool = $('#activeTool'),
    lineRound = true,
    save = $('#save'),
    imgInfo = $('#imgInfo'),
    sizeVal = $('#sizeLabelVal'), sizing = false,
    ampVal = $('#ampLabelVal'), amplify = false,
    addLayerBtn = $('#addLayer'),
    inputAmp = $('#line-amplifier'),    
    inputSize = $('#line-size'),
    actives = 0,
    help = $('#help'),
    Layer = {
      params: function(){
        this.cells = [];
        this.lines = [];
        this.color = "#000000";
        return this;
      }
    },
    Line = function(i1, i2, color){
      return {
        i1: i1,
        i2: i2,
        color: color
      }
    },
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
                 y: (index - x) / cols
        }
      };
   
/*  ////    GET Index   ///// */
  getIndex = function(x, y){
    return rows * y + x;
  };    

    
/* ///////  LINE CHECK   /////////// */
  checkLines = function(cells, a){
      
    var layer = layers[layers.length-1],
        i0=undefined,
        max1=max2=max3=max4=0;
    for(var i=0, l=cells.length; i<l-1; i++){
      if (i0 == undefined){
          i0 = i; 
      } else {
        switch (cells[i]-cells[i0]){
          case (cols+1):
            max1 = (i > max1) ? lineCheck(cells, i0, i, l, cols+1) : max1;   
            break;
          case (cols-1):
            max2 = (i > max2) ? lineCheck(cells, i0, i, l, cols-1) : max2;    
            break;
          case cols: 
            max3 = (i > max3) ? lineCheck(cells, i0, i, l, cols) : max3;           
            break;
          case 1:
            max4 = (i > max4) ? lineCheck(cells, i0, i, l, 1) : max4;     
            break;
          default:
            i0 = undefined; 
           // max1=max2=max3=max4=0;
          }
      }
    }  
  };
  function lineCheck(cells, i0, i, len, value){
    var lineLength = 2, lasti = i,  
        a = ((amp>0) ? amp : 1) * lineWidth,
        res = 0;
    for(var j=i+1; j<len; j++){
      if (cells[j] - cells[lasti] == value){
          lasti = j;
          lineLength++;
      }
    }
    if (lineLength > 2) {
        drawLine(a, cells[i0], cells[lasti]);
        res = j;
    }
    return res;
  };   

    
/* /////    RENDER PREVIEW   ///// */
  renderPreview = function(){      
    var cells = layers[layers.length-1].cells,
        a, tempIndex;
    
    /* index passed? => already exist? remove : add */  
    if (arguments.length){
      tempIndex = cells.indexOf(arguments[0]);
      if (tempIndex > -1) cells.splice(tempIndex, 1);
      else cells.push(arguments[0]);
    } 
    
    /* clear preview screen + set basic params */
    context.clearRect(0, 0, canvas.width(), canvas.height());
    a = ((amp>0) ? amp : 1) * lineWidth;
    context.lineWidth = lineWidth;
    
    /* if more than 1 layer => draw them first */  
    if (layers.length > 1) 
      drawLayers(layers, a);  
      
    /* check tool value => process data */    
    switch (tool){
      case "dot":
      case "autoline":
        dotTool(cells, a);  
        break;
      case "line":
        lineTool(cells, a);
        break;
    }
  };    
    
/* ///   DRAW  LAYERS  //// */    
 drawLayers = function(layers, a){
   var loc1, tmpx, tmpy;
   layers.forEach(function(l){
    
    context.fillStyle = l.color;
    if (l.cells.length)
      for (var i=0; i<l.cells.length; i++){
        loc1 = getXY(l.cells[i]);
        tmpx = (loc1.x * a) - lineWidth/2;
        tmpy = (loc1.y * a) - lineWidth/2;
        context.fillRect(tmpx, tmpy, lineWidth, lineWidth);
      };
    if (l.lines.length)
      for (var i=0; i<l.lines.length; i++){
        context.strokeStyle = "#" + l.lines[i].color;
        drawLine(a, l.lines[i].i1, l.lines[i].i2);
      }
  }); 
 }    
    
/* /////     DOT TOOL   //// */
 dotTool = function(cells, a){
  var tmpx, tmpy, actives=0;     
  layers[layers.length-1].color = "#" + hex;    
     
  /* sort cells */
  cells = cells.sort();
     
  for(var i=0; i < cells.length; i++){ 
    loc = getXY(cells[i]);
    tmpx = (loc.x * a) - lineWidth/2;
    tmpy = (loc.y * a) - lineWidth/2;
    context.fillRect(tmpx, tmpy, lineWidth, lineWidth);
  }
  if (cells.length > 2 && tool==="autoline") checkLines(cells, a);   
 };    
    
    
/* draw a line */
function drawLine(a, i1, i2){
  loc1 = getXY(i1);
  loc2 = getXY(i2);
  context.beginPath();
  context.moveTo(loc1.x * a, loc1.y * a);
  context.lineTo(loc2.x * a, loc2.y * a);
  context.stroke();
};
    
/* line tool */
 lineTool = function(cells, a){
  var fCol = $('.f-col'),
      layer = layers[layers.length-1],
      loc1, loc2;  
     
  if (layer.lines.length > 0){
    for (var i=0, l=layer.lines; i<l.length; i++){
      context.strokeStyle = context.fillStyle = "#" + l[i].color;
      drawLine(a, l[i].i1, l[i].i2);
    }
  };
   
  context.strokeStyle = context.fillStyle = "#" + hex;
  switch (cells.length){
    case 0: break;
    case 1: 
      layer.i1 = cells[0]; 
      break;
    case 2: 
      layer.i1 = cells[0]; 
      layer.i2 = cells[1]; 
      drawLine(a, layer.i1, layer.i2);  
      break;
    default: 
      layer.lines.push(Line(layer.i1, layer.i2, hex));
      drawLine(a, layer.i1, layer.i2);
      fCol.removeClass('active').css('background-color', '#ffffff');        
      cells.length = 0;
   }     
 };        
    
    
/* RENDER grid */
    renderGrid = function(){
      var html = '', i = 0;
      inputAmp.append($('<option></option>').val(0).html(0));
      for (k=1;k<=32;k++){
        inputAmp.append($('<option></option>').val(k).html(k));
        inputSize.append($('<option></option>').val(k).html(k));
      }  
      inputAmp.val(3);
      inputSize.val(2);

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
      layers.length = 0;
      layers[0] = Object.create(Layer).params();
    };
    
    

/* reset Output image */
    resetOutput = function(){
        var tmpAmp, tmpW, tmpH;
        
        amp = $('#line-amplifier').val();
        lineWidth = $('#line-size').val();
        tmpAmp = (amp > 0) ? lineWidth * amp : lineWidth;
        tmpW = ((cols - 1) * tmpAmp);
        tmpH = ((rows - 1) * tmpAmp); 
        
        canvas.attr('width', tmpW +'px').attr('height', tmpH + 'px');
        canvas.height(canvas.width() / cols * rows);        
        imgInfo.html("img " + canvas.attr('width') + " * " + canvas.attr('height') + "");
        //sizeVal.html("size[" + lineWidth + "]");
        //ampVal.html("amp[" + amp + "]");
        
        renderPreview();
    };

    
/* on change amplitude value */
  $('#line-amplifier').change(resetOutput);    
    
/* on change lineSize value */    
  $('#line-size').change(resetOutput);             
    
/* set instructions on when active tool is changed */    
 activeTool.change(function(){
    var thee = $(this).val();
    switch (thee){
      case "line":
        help.html("<span>[ line mode ]</span><br><span>* Click on one cell - to set start point, on second - end point, third to save the line.</span><br><span>* Start and end points can be changed before the click on other cells.</span>");    
        break;
      case "dot":
        help.html("<span>[ dot mode ]</span><br><span>* Every cell toggles. Color change affects whole layer.</span><br><span>* To save changes / layer press [save].</span>");      
        break;
      case "autoline":
        help.html("<span>[ auto-line mode ]</span><br><span>* Works like [dot] mode. For more than 2 active cells starts searching for lines. </span><br><span>* Not finished yet. At this moment extends one line at a time.</span>");  
        break;
    }
 });    
    
/* button toggle */
 function buttonClick(){
    var thisColor, thee = $(this), layer = layers[layers.length-1];
    thee.toggleClass('active');
    thisColor = (thee.hasClass('active')) ? hex : "ffffff"; 
    thee.css('background-color', '#'+thisColor);
    tool = activeTool.val(); 
    renderPreview(thee.data('i')); // clicked index
 };

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

/* reset everything */
    resetBtn.on('click', function(){
        locHue.x = 0;
        locHue.y = 0; 
        locSaVa.x = 0; 
        locSaVa.y = imageSVheight; 
        outData(0, 100, 0, 0, 0, 0, "000000");
        cols = +$('#cols').val();
        rows = +$('#rows').val();
        colSize = (100 / cols).toPrecision(7) + '%';
        renderGrid();
        cells.on('click', buttonClick);
        resetOutput();
    });    

/*    
inputAmp.on('touchstart mousedown', function() { 
  amplify = true;
});
inputAmp.on('touchmove mousemove', function() { 
  if (amplify){ ampVal.html("amp[" + inputAmp.val() + "]");        
}
});
inputAmp.on('touchend mouseend', function(e) { 
  amplify = false;
});
    
inputSize.on('touchstart mousedown', function() { 
  sizing = true;
});
inputSize.on('touchmove mousemove', function() { 
  if (sizing){ sizeVal.html("size[" + inputSize.val() + "]");        
}
});
inputSize.on('touchend mouseend', function(e) { 
  sizing = false;
});    
*/ 
    
/* /////////    ADD LAYER   /////////*/
addLayer = function(){
  layers[layers.length-1].color = "#" + hex;
  $('.f-col').removeClass('active').css('background-color', '#ffffff'); 
  layers.push(Object.create(Layer).params());
};    
    
    
/* /////    on click Add Layer  ////// */
addLayerBtn.on('click', addLayer);
    
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
        context.fillStyle = "#" + hex;
    });  
});