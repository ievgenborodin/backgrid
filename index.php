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
  <script src="js/objects.js"></script>    
  <script src="js/grid.js"></script>    
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <div id="header" class="row">
          <div class="col-xs-12">
            <h2 id="title">Grid Editor</h2>
            <span id="description">background pattern tool</span>
          </div>
        </div>
        <div class="row">
          <div id="main" class="col-xs-8">
            <div class="row">
              <div class="col-xs-12" id="field">
                <div class="row">
                  <div class="f-col col-xs-4"></div>
                  <div class="f-col col-xs-4"></div>
                  <div class="f-col col-xs-4"></div>
                </div>
                <div class="row">
                  <div class="f-col col-xs-4"></div>
                  <div class="f-col col-xs-4"></div>
                  <div class="f-col col-xs-4"></div>
                </div>
                <div class="row">
                  <div class="f-col col-xs-4"></div>
                  <div class="f-col col-xs-4"></div>
                  <div class="f-col col-xs-4"></div>
                </div>
              </div>  
            </div>
            <div id="footer" class="row">
              <div class="col-xs-12">
                  Instructions:
              </div>  
            </div>
          </div>
          <div id="tools" class="col-xs-4">
            <div class="row">
              <div class="col-xs-12">
              </div>
              <div class="col-xs-6 lbl">rows</div>
              <div class="col-xs-6 lbl">cols</div>
              <div class="col-xs-6">
                  <input type="text" id="rows" size="2" value="3">
              </div>
              <div class="col-xs-6">
                  <input type="text" id="cols" size="2" value="3">
              </div>
              <div class="col-xs-12">
                  <span id="reset" class="btn btn-default">reset</span>
              </div>
              <div id="sizeLabelVal" class="col-xs-5 lbl">size</div>    
              <div class="col-xs-7">
                <input id="line-size" type="range" min="1" max="16" step="1" value="1"></span>
              </div>
              <div id="ampLabelVal" class="col-xs-5 lbl">amp</div>    
              <div class="col-xs-7">
                <input id="line-amplifier" type="range" min="0" max="16" step="1" value="4"></span>
              </div>
              <div class="col-xs-5 lbl">color</div>    
              <div id="color" class="col-xs-7 color">
                <span id="color-span" class="colorSpot"></span>
              </div>
              <div class="col-xs-12">
                  <span id="addLayer" class="btn btn-default tmar">add layer</span>
              </div>
              <div class="col-xs-12 lbl tmar">output</div>
              <div class="col-xs-12">
                <canvas id="canvas">Not supported</canvas>  
              </div>
              <div id="imgInfo" class="col-xs-12 lbl">img 80 x 120 [px]</div>
              <div class="col-xs-12">
                <span id="save" class="btn btn-default">save</span>  
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