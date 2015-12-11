define(function() {
  var ui = {
    
    backgroundCheckId: 'background-check',  
    backgroundImgId: 'background-img',  
    
    colorSpanId: 'color-span',
    
      
    activeToolId: 'activeTool',
    imageSizeId: 'image-size',  
      
    help: {  
      "line": "<span>[ line mode ]</span><br><span>* Click on one cell - to set start point, on second - end point, third to save the line.</span><br><span>* Start and end points can be changed before the click on other cells.</span>",
      "dot": "<span>[ dot mode ]</span><br><span>* Every cell toggles. Color change affects whole layer.</span><br><span>* To save changes / layer press [save].</span>",
      "autoline": "<span>[ auto-line mode ]</span><br><span>* Works like [dot] mode. For more than 2 active cells starts searching for lines. </span><br><span>* Not finished yet. At this moment extends one line at a time.</span>",
      "default": "<span>* Change [rows], [cols] and press [reset] to modify grid.</span><br><span>* Choose mode: [line], [dot] or [auto-line].</span><br><span>* Press [save] to save changes.</span><br><span>* Line [size] and [scale] can be changed anytime.</span>"
    },  
      
    
    /* dim background */  
    darknessId: 'darkness', /* div# */  
      
    /*// color picker //*/      
    pickerWrapId: 'picker-wrap', /* div# */ 
    pickerId: 'picker', /* div# */ 
      
    pickerSVWrapId: 'picker-sv-wrap', /* div# */
    pickerSVId: 'picker-sv', /* img# */
    pickerSVPointerId: 'picker-sv-pointer',/* span# */ 
    
    pickerHWrapId: 'picker-h-wrap', /* div# */  
    pickerHId: 'picker-h', /* img# */ 
    pickerHPointerId: 'picker-h-pointer', /* span# */ 
    
    pickerControlsWrapId: 'picker-controls-wrap', /* div# */  
    pickerOkId: 'picker-ok', /* div# */  
    pickerPreviewId: 'picker-preview', /* div# */ 
    pickerHashId: 'picker-hash' /* div# */  
  };
    
  return ui;
});