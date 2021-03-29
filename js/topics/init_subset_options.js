/* get subset options and initialize dropdown options */
function initSubsetOptions() {
    $.getJSON('./php/get_subset_options.php', function(data) {
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
    for (const field of fields) {
        var dropdown = document.getElementById(`selected-${field}`);
        for (const val of data[field].slice(0, 7000)) {
            var option = document.createElement("option");
            option.text = val;
            option.value = val;
            dropdown.appendChild(option);
        }
    }
}
