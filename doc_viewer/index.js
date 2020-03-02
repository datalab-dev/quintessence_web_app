$(document).ready(function () {
  initPagemap();
  initButtons();
  initTooltip();
});

function initPagemap() {
  pagemap(document.querySelector("#map"), {
    viewport: null,
    styles: {
      "header,footer,section,article": "rgba(0, 0, 0, 0.08)",
      p: "rgba(0, 0, 0, 0.10)",
      "h2,h3,h4": "rgba(0, 0, 0, 0.08)",
      "mark.org": "#7aecec",
      "mark.gpe": "#feca74",
      "mark.date": "#bfe1d9",
      "mark.loc": "#ff9561",
      "mark.norp": "#c887fb",
      "mark.fac": "#ddd",
      'mark.noun': '#0c655e',
      'mark.verb': '#845ca1',
      'mark.t5': '#cc6d55',
      'mark.t20': '#9b91ac'
    },
    back: "rgba(0, 0, 0, 0.02)",
    view: "rgba(0, 0, 0, 0.05)",
    drag: "rgba(0, 0, 0, 0.10)",
    interval: null
  });
}

function initButtons(){
  $('.btn-group .btn').click(function(){
    // button styles
    $('.btn-active').removeClass('btn-active');
    $(this).addClass('btn-active');
    // hide or show relevant document
    $('.fig-active').removeClass('fig-active');
    $('figure').eq( $(this).index() ).addClass('fig-active');
    // reset minimap on mode change
    $('#map').remove();
    $('main').append('<canvas id="map"></canvas>');

    initPagemap();
  });
}

function initTooltip(){

  $('.word-tag').tooltipster({
    content: 'Loading...',
    contentAsHTML: true,
    contentCloning: true,
    trigger: 'click',
    animation: 'fade',
    delay: 200,
    distance: 2,
    interactive: true,
    //theme: 'tooltipster-borderless',
    functionBefore: function(instance, continueTooltip) {
      $(instance).tooltipster('content', buildTooltipContent(instance));
      continueTooltip();
    }
  });
}

function buildTooltipContent(trigger) {
  // This is where we add SQL calls
  var html = "<strong> Word Details </strong></br><strong>Word: </strong> " + $(trigger).text() + "</br><strong>Details: </strong><i>Loading...</i>";
  return html;
}