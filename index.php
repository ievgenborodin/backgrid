<!DOCTYPE html>
<html>
<head>
  <title>Grid Editor</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
  <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
  <!--<link rel="shortcut icon" href="css/grid.ico" />-->
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/picker.css">
  <link rel="stylesheet" href="css/input.css">
  <script data-main="js/app" src="js/lib/require.js"></script>
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2">
       
        <div class="row">
         
          <div class="col-xs-8">
            <div class="row marl">
              <div id="header" class="col-xs-12">
                <h2 id="title">BackGrid</h2>
                <p id="description">scalable background pattern tool</p>
              </div>
              <div class="col-xs-12 col-sm-10 col-sm-offset-1" id="field">
              </div>  
            </div>
            <div id="footer" class="row">
              <div id="help" class="col-xs-12"></div>  
            </div>
          </div>
          
          <div class="col-xs-4">
            <div id="right-side" class="row">
              <div class="col-xs-12 block-lable">controls</div>
              <div class="block-itself">
                  <div class="col-xs-6 lbl">rows</div>
                  <div class="col-xs-6 lbl">cols</div>
                  <div class="col-xs-6">
                      <div id="rows">4</div>
                  </div>
                  <div class="col-xs-6">
                      <div id="cols">4</div>
                  </div>
                  <div class="col-xs-12">
                      <span id="reset" class="btn btn-default">reset</span>
                  </div>
                  <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2" id="background-wrap">
                      <input type="checkbox" id="background-check"> background <span id="background-img"></span>
                  </div>
                  <div class="col-xs-4 lbl">tool</div>    
                  <div id="tool-col" class="col-xs-8">
                    <select id="activeTool">
                      <option value="line">line</option>    
                      <option value="dot">dot</option>
                      <option value="autoline">auto</option>
                    </select>
                  </div>
                  <div id="color-span-lbl" class="col-xs-3"></div>
                  <div id="color-span"></div>
                  <div class="col-xs-12">
                      <span id="addLayer" class="btn btn-default tmar">save</span>
                  </div>
              </div>    
              <div class="block-itself">    
                  <div class="col-xs-12 block-lable">output file</div>    
                  <div id="sizeLabelVal" class="col-xs-6 lbl">size</div>    
                  <div class="col-xs-6">
                    <div id="line-size">2</div>
                  </div>
                  <div id="ampLabelVal" class="col-xs-6 lbl">scale</div>    
                  <div class="col-xs-6">
                    <div id="line-amplifier">3</div>
                  </div>
                  <div class="col-xs-12 lbl">preview</div>
                  <div class="col-xs-12">
                    <canvas id="canvas">Not supported</canvas>  
                  </div>
                  <div id="image-size" class="col-xs-12 lbl">img 80 x 120 [px]</div>
                  <div class="col-xs-12">
                    <span id="save" class="btn btn-default">
                      download
                    </span>  
                  </div>
                  <div class="col-xs-12">
                    <span id="test" class="btn btn-default">
                      live preview
                    </span>  
                  </div>
              </div>
            </div>
          </div>
          
        </div>
        
         <!--//////   test block   //////-->
          <div id="test-block-wrap">
            <div id="test-block">
              <div id="test-close">&#10005;</div>
              <img id="test-image">
            </div>      
          </div> 
        
      </div>
    </div>  
  </div>
  
  <!--//////   dim background   //////-->
  <div id="darkness"></div>
    
  <!--///////    color picker    ///////-->    
  <div id="picker-wrap">
    <div id="picker">
      <div id="picker-sv-wrap">
        <img src="img/picker-bg.png" id="picker-sv" class="img-responsive" />
        <span id="picker-sv-pointer"></span>
      </div>
      <div id="picker-h-wrap">
        <img src="img/picker-color.png" id="picker-h" />
        <span id="picker-h-pointer"></span>
      </div>
      <div id="picker-controls-wrap">
        <div class="btn" id="picker-ok">Ok</div>
        <div id="picker-preview"></div>
        <div id="picker-hash-wrap">
          #<div id="picker-hash"></div>;
        </div>
      </div>
    </div>
  </div> 
  
  <!-- input -->
  <div id="input-wrap">
    <div id="input">
      <div title="Done" id="input-done">&#10003;</div>
      <div class="brow" id="input-buttons">
        <div id="input-backspace">&larr;</div>
      </div>
    </div>
  </div>
   
</body>
</html>
