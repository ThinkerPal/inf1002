// Sidebar function

const API_URL = "http://localhost:8000"

document.addEventListener("DOMContentLoaded", function () {
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");
    const closeSidebarButton = document.getElementById("closeSidebar");
    const toggleButton = document.getElementById("toggleButton"); // Add this line

    if (toggleButton) {
        toggleButton.addEventListener("click", function () {
            sidebar.classList.toggle("show");
            handleSidebarState();
        });
    }

    if (closeSidebarButton) {
        closeSidebarButton.addEventListener("click", function () {
            sidebar.classList.remove("show");
            handleSidebarState();
        });
    }

    // Toggle button visibility based on sidebar state
    const handleSidebarState = () => {
        if (window.outerWidth <= 768) {
            if (toggleButton) {
                toggleButton.style.display = sidebar.classList.contains("show") ? "none" : "block";
            }
        } else {
            if (toggleButton) {
                toggleButton.style.display = "none";
            }
        }
    };

    // Initially hide the toggleButton on page load
    handleSidebarState();

    // Event listener for window resize
    window.addEventListener("resize", handleSidebarState);
   
});



$(document).ready(function () {
    const originalOrder = $(".location-checkbox").html(); // Store the original order

    // Function to sort checkboxes in ascending order based on their associated labels
    function sortCheckboxesAscending() {
        const checkboxes = $(".location-checkbox input[type=checkbox]:not(#select-all)");
        const labels = $(".location-checkbox label:not(#select-all)").get();

        labels.sort((a, b) => a.textContent.localeCompare(b.textContent));

        // Rearrange the labels and checkboxes, but keep "SELECT ALL" at the top
        const selectAllParent = $("#select-all").parent();
        checkboxes.each((index, checkbox) => {
            const parent = checkbox.parentElement;
            if (parent !== selectAllParent) {
                parent.parentElement.prepend(parent); // Move the container to the end
            }
        });
    }

    // Function to sort checkboxes in descending order based on their associated labels
    function sortCheckboxesDescending() {
        const checkboxes = $(".location-checkbox input[type=checkbox]:not(#select-all)");
        const labels = $(".location-checkbox label:not(#select-all)").get();

        labels.sort((a, b) => b.textContent.localeCompare(a.textContent));

        // Rearrange the labels and checkboxes, but keep "SELECT ALL" at the top
        const selectAllParent = $("#select-all").parent();
        checkboxes.each((index, checkbox) => {
            const parent = checkbox.parentElement;
            if (parent !== selectAllParent) {
                parent.parentElement.prepend(parent); // Move the container to the end
            }
        });
    }


    // Event listener for the "Ascending" button
    $(".sort-advanced .ascending").on("click", function (event) {
        sortCheckboxesAscending();
        event.stopPropagation(); // Prevent the event from propagating up and closing the dropdown
    });

    // Event listener for the "Descending" button
    $(".sort-advanced .descending").on("click", function (event) {
        sortCheckboxesDescending();
        event.stopPropagation(); // Prevent the event from propagating up and closing the dropdown
    });

    $("#select-all").on("change", function () {
        const checkboxes = $(".location-checkbox input[type=checkbox]:not(#select-all)");
        checkboxes.prop("checked", this.checked);
    });
    

    // Event listener for the "Apply Filter" button
    $(".end-filter .apply-filter").on("click", function (event) {
        const selectedLocations = $(".dropdown-menu input[type=checkbox]:checked")
            .map(function () {
                return $(this).siblings("label").text();
            })
            .get();

        // Display selected locations on the map
        displaySelectedLocations(selectedLocations);

        event.stopPropagation(); // Prevent the event from propagating up and closing the dropdown
    });

    // Event listener for the "Clear Filter" button
    $(".end-filter .clear-filter").on("click", function (event) {
        // Uncheck all checkboxes except the "Select All" checkbox
        $(".dropdown-menu input[type=checkbox]:not(#select-all)").prop("checked", false);
        // Restore the original order without closing the list
        $(".location-checkbox").html(originalOrder);
        
        event.stopPropagation(); // Prevent the event from propagating up and closing the dropdown
    });
    let townSelector = document.getElementById("town-selector");
    if (townSelector){
        axios.get(`${API_URL}/towns`).then((res) => {
            townSelector.innerHTML += res.data?.sort().map((town) => {
                return town ? `<option value="${town}">${town}</option>` : `<></>`
            })
        })
        townSelector.innerHTML = `<option value="all">All<option>` + townSelector.innerHTML
    };
});

    

    
