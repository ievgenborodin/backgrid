/* //////     CONFIG    /////// */
require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: 'js/lib',
    paths: {
        'src': '../src'
    },
    enforceDefine: true
});

/* //////     MAIN    /////// */
define(["jquery", "src/picker", "src/input", "src/ui"], function($, Picker, Input, ui) {
    /* // vars // */
   var picker = new Picker(),
       
    layers = [],
    cols, rows, colSize, cells, color,
    field = $('#field'),
    fWidth = field.width(),
    setBtn = $('#set'),
    resetBtn = $('#reset'),
    canvas = $('#canvas'),
    context = canvas[0].getContext('2d'),
    lineWidth = 1, 
    amp = 4,
    tool,
    lineRound = true,
    sizeVal = $('#sizeLabelVal'), sizing = false,
    ampVal = $('#ampLabelVal'), amplify = false,
    addLayerBtn = $('#addLayer'),
    inputAmp = $('#line-amplifier'),    
    inputSize = $('#line-size'),
    darkness = $('#' + ui.darknessId),
    actives = 0,
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
   
    help = $('#help'),
    activeTool = $('#' + ui.activeToolId),
    imgSize = $('#' + ui.imageSizeId),
    colorSpan = $('#' + ui.colorSpanId),   
    background = {
      on: false,
      color: '#203'
    },
    backgroundCheck = $('#' + ui.backgroundCheckId),
    backgroundImg = $('#' + ui.backgroundImgId);
    
    
    /* set background */
    backgroundCheck.on('click', function(e){
        var tmp;
        if ($(this)[0].checked) {
            background.on = true; 
            tmp = 'inline-block';
        }else{ 
            background.on = false;
            tmp = 'none';
        }
        backgroundImg.css('display', tmp);
        renderPreview();
    });
    backgroundImg.on('click', function(e){
        darkness.css('height', window.innerHeight)
                .css('display', 'block');
        picker.init($(this), onBackgroundChange);
    });
    
    colorSpan.on('click', function(e){
        darkness.css('height', window.innerHeight)
                .css('display', 'block');
        picker.init($(this));
    });
    
    /* set help */    
    setHelp("default");
    activeTool.change(function(){
      setHelp($(this).val());
    });
    
    /* set grid */
    setGrid();
    resetBtn.on('click', setGrid);    
    
    /* set events */
    addLayerBtn.on('click', addLayer);
    $('#save').on('click',function(){
        $.post("html/save.php", {
            data: canvas[0].toDataURL("image/png")
        }, function (file) {
            window.location.href =  "html/download.php?path=" + file
        });
    });    
    $('#test').on('click',function(){
        darkness.css('height', window.innerHeight)
                .css('display', 'block');
        $('#test-image').css('background', 'url(' + canvas[0].toDataURL() + ') repeat');
        $('#test-block-wrap').css('display', 'block');
    });
    $('#test-close').on('click',function(){
        darkness.css('display', 'none');
        $('#test-block-wrap').css('display', 'none');
    });   
    $('#line-amplifier').change(resetOutput);        
    $('#line-size').change(resetOutput);             


    
    function setHelp(value){
      switch (value){
        case "line":
          help.html(ui.help.line);    
          break;
        case "dot":
          help.html(ui.help.dot);      
          break;
        case "autoline":
          help.html(ui.help.autoline);  
          break;                
        case "default":
        default:
          help.html(ui.help.default);
      }  
    };
    function onBackgroundChange(){
        var color = backgroundImg.css('background-color');
        background.color = color;
        renderPreview();
    };
    function getIndex(x, y){
      return rows * y + x;
    };     
    function getXY(index){
      var x = index % cols; 
      return { 
        x: x,
        y: (index - x) / cols
      }
    };
    function checkLines(cells, a){

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
    function renderPreview(){      
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

        /* draw background */
        if (background.on) {
          context.fillStyle = background.color;
          context.fillRect(0,0, canvas[0].width, canvas[0].height);
        }   

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
    function drawLayers(layers, a){
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
    function dotTool(cells, a){
      var tmpx, tmpy, actives=0,
          color = colorSpan.css('background-color');     
      layers[layers.length-1].color = color;    

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
    function drawLine(a, i1, i2){
      loc1 = getXY(i1);
      loc2 = getXY(i2);
      context.beginPath();
      context.moveTo(loc1.x * a, loc1.y * a);
      context.lineTo(loc2.x * a, loc2.y * a);
      context.stroke();
    };
    function lineTool(cells, a){
      var fCol = $('.f-col'),
          layer = layers[layers.length-1],
          loc1, loc2, color = colorSpan.css('background-color');  

      if (layer.lines.length > 0){
        for (var i=0, l=layer.lines; i<l.length; i++){
          context.strokeStyle = context.fillStyle = l[i].color;
          drawLine(a, l[i].i1, l[i].i2);
        }
      };

      context.strokeStyle = context.fillStyle = color; 
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
          layer.lines.push(Line(layer.i1, layer.i2, color));
          drawLine(a, layer.i1, layer.i2);
          fCol.removeClass('active').css('background', 'none');        
          cells.length = 0;
       }     
     };        
    function renderGrid(){
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
    function addLayer(){
      var color = colorSpan.css('background-color');    
      layers[layers.length-1].color = color;
      $('.f-col').removeClass('active').css('background-color', '#ffffff'); 
      layers.push(Object.create(Layer).params());
    };    
    function setGrid(){
        cols = +$('#cols').val();
        rows = +$('#rows').val();
        colSize = (100 / cols).toPrecision(7) + '%';
        background.on = false;
        backgroundCheck[0].checked = false;
        backgroundImg.css('display', 'none');
        renderGrid();
        cells.on('click', toggleClick);
        resetOutput();
    };    
    function toggleClick(){
        var thisColor, thee = $(this), layer = layers[layers.length-1],
            color = colorSpan.css('background-color');
        thee.toggleClass('active');
        thisColor = (thee.hasClass('active')) ? color : "none"; 
        thee.css('background', thisColor);
        tool = activeTool.val(); 
        renderPreview(thee.data('i')); // clicked index
     };      
    function resetOutput(){
      var tmpAmp, tmpW, tmpH;
      amp = $('#line-amplifier').val();
      lineWidth = $('#line-size').val();
      tmpAmp = (amp > 0) ? lineWidth * amp : lineWidth;
      tmpW = ((cols - 1) * tmpAmp);
      tmpH = ((rows - 1) * tmpAmp); 

      canvas.attr('width', tmpW +'px').attr('height', tmpH + 'px');
      canvas.height(canvas.width() / cols * rows);        
      imgSize.html("img " + canvas.attr('width') + " * " + canvas.attr('height') + "");

      renderPreview();
    };    
});