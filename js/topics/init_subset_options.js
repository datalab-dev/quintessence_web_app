/* get subset options and initialize dropdown options */
function initSubsetOptions() {
    $.getJSON('./json/subset_options.json', function(data) {
        populateSubsetOptions(data);
    });
}

/* populate dropdown options */
function populateSubsetOptions(data) {
    $('.ui.dropdown').dropdown();
    var $range = $(".js-range-slider");
    $range.ionRangeSlider({
        type: "double",
        min: 1470,
        max: 1700,
    });

    var fields = ['keywords', 'authors', 'locations'];
    fields.forEach(function(field) {
        var dropdown = document.getElementById(`selected-${field}`);
        data[field].forEach(function(val) {
            var option = document.createElement("option");
            option.text = val;
            option.value = val;
            dropdown.appendChild(option);
        });
    });
}
