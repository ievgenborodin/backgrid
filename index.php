<!doctype html>
<html>
<head>
  <title>Grid Editor</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
  <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
  <link rel="shortcut icon" href="css/grid.ico" />
  <link rel="stylesheet" href="../css/bootstrap.min.css">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/picker.css">
  <script src="../js/jquery.js"></script> 
  <script src="js/grid.js"></script>    
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2">
        <div class="row">
          <div id="main" class="col-xs-8">
            <div class="row marl">
              <div id="header" class="col-xs-12">
                <h2 id="title">BackGrid</h2>
                <p id="description">scalable background pattern tool</p>
              </div>
              <div class="col-xs-12 col-sm-10 col-sm-offset-1" id="field">
              </div>  
            </div>
            <div id="footer" class="row">
              <div id="help" class="col-xs-12">
                  <span>* Change [rows], [cols] and press [reset] to modify grid.</span><br>
                  <span>* Choose mode: [line], [dot] or [auto-line].</span><br>
                  <span>* Press [save] to save changes.</span><br>
                  <span>* Line [size] and [scale] can be changed anytime.</span>
              </div>  
            </div>
          </div>
          <div id="tools" class="col-xs-4">
            <div id="right-side" class="row">
              <div class="col-xs-12 block-lable">controls</div>
              <div class="block-itself">
                  <div class="col-xs-6 lbl">rows</div>
                  <div class="col-xs-6 lbl">cols</div>
                  <div class="col-xs-6">
                      <input type="text" id="rows" size="2" value="4">
                  </div>
                  <div class="col-xs-6">
                      <input type="text" id="cols" size="2" value="4">
                  </div>
                  <div class="col-xs-12">
                      <span id="reset" class="btn btn-default">reset</span>
                  </div>
                  <div class="col-xs-4 lbl">tool</div>    
                  <div id="tool-col" class="col-xs-8">
                    <select id="activeTool">
                      <option value="line">line</option>    
                      <option value="dot">dot</option>
                      <option value="autoline">autoline</option>
                    </select>
                  </div>
                  <div class="col-xs-4 lbl">color</div>    
                  <div id="color" class="col-xs-7 color">
                    <span id="color-span" class="colorSpot"></span>
                  </div>
                  <div class="col-xs-12">
                      <span id="addLayer" class="btn btn-default tmar">save</span>
                  </div>
              </div>    
              <div class="block-itself">    
                  <div class="col-xs-12 block-lable">output file</div>    
                  <div id="sizeLabelVal" class="col-xs-6 lbl">size</div>    
                  <div class="col-xs-6">
                    <select id="line-size"></select>
                  <!--  <input id="line-size" type="range" min="1" max="16" step="1" value="1">-->
                  </div>
                  <div id="ampLabelVal" class="col-xs-6 lbl">scale</div>    
                  <div class="col-xs-6">
                    <select id="line-amplifier"></select>
                   <!-- <input id="line-amplifier" type="range" min="0" max="32" step="1" value="4">-->
                  </div>
                  <div class="col-xs-12 lbl tmar">preview</div>
                  <div class="col-xs-12">
                    <canvas id="canvas">Not supported</canvas>  
                  </div>
                  <div id="imgInfo" class="col-xs-12 lbl">img 80 x 120 [px]</div>
                  <div class="col-xs-12">
                    <span id="save" class="btn btn-default">download</span>  
                  </div>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  </div>
    
  <div id="greyIsh"></div>
  <div id="divPickerHolder">
    <div id="divPicker">
        <div id="pickerWorkingSpace">
            <div id="divPickerBG">
                <img src="img/picker-bg.png" id="pickerBG" class="img-responsive" />
                <span id="pointerBG"></span>
            </div>
            <div id="divPickerColor">
                <img src="img/picker-color.png" id="pickerColor" />
                <span id="pointerColor"></span>
            </div>
        </div>
        <div class="clear"></div>
        <div id="divPickerControls">
            <div class="buttons">
                <span class="btn btn-default" id="btnOk">Ok</span>
            </div>
            <div class="buttons">
                <span id="colorSpot" class="colorSpot"></span>
            </div>
            <div class="buttons">
                #<input type="text" class="colorHash" value="000000" />;
            </div>
            
        </div>
    </div>
  </div>     
</body>
</html>