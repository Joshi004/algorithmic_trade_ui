export const showPopup = function(messageObj, tone="neutral", time=3) {
    // Create a new div element for the popup
    var popup = document.createElement("div");

    // Create a new div element for the title
    var title = document.createElement("div");
    title.textContent = messageObj.title;
    title.style.fontWeight = "bold";
    title.style.fontSize = "20px";
    title.style.borderBottom = "1px solid white";
    title.style.paddingBottom = "10px";
    title.style.marginBottom = "10px";

    // Create a new div element for the message
    var message = document.createElement("div");
    message.textContent = messageObj.message;
    message.style.fontSize = "16px";

    // Create a new div element for the close button
    var closeButton = document.createElement("div");
    closeButton.textContent = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "20px";

    // Add the title, message, and close button to the popup
    popup.appendChild(title);
    popup.appendChild(message);
    popup.appendChild(closeButton);

    // Set the background color and text color based on the tone
    var backgroundColor, textColor;
    switch (tone) {
        case "positive":
            backgroundColor = "#4CAF50"; // green
            textColor = "white";
            break;
        case "negative":
            backgroundColor = "#f44336"; // red
            textColor = "white";
            break;
        case "neutral":
            backgroundColor = "#FFD700"; // yellow
            textColor = "black";
            break;
        default:
            backgroundColor = "light-grey"; // red
            textColor = "black";
    }

    // Style the popup
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.backgroundColor = backgroundColor;
    popup.style.color = textColor;
    popup.style.padding = "20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.25)";
    popup.style.zIndex = "1000";
    popup.style.transition = "all 0.5s ease-in-out";
    popup.style.opacity = "0";
    popup.style.maxWidth = "800px"; // Limit the width to 800px
    popup.style.overflowWrap = "break-word"; // Break words properly if they're too long

    // Add the popup to the body of the document
    document.body.appendChild(popup);

    // Animate the popup in
    setTimeout(function() {
        popup.style.opacity = "1";
        popup.style.transform = "translateY(0px)";
    }, 100);

    // If a time is provided, animate the popup out after the specified time
    var timeoutId;
    if (time) {
        timeoutId = setTimeout(hidePopup, (time - 0.5) * 1000);
    }

    // Function to hide the popup
    function hidePopup() {
        popup.style.opacity = "0";
        popup.style.transform = "translateY(-50px)";

        // Remove the popup after the animation
        setTimeout(function() {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        }, 500);
    }

    // If the user is hovering over the popup, clear the timeout
    popup.addEventListener("mouseover", function() {
        clearTimeout(timeoutId);
    });

    // If the user stops hovering over the popup, start the timeout again
    popup.addEventListener("mouseout", function() {
        if (time) {
            timeoutId = setTimeout(hidePopup, (time - 0.5) * 1000);
        }
    });

    // Add a click event listener to the close button to remove the popup
    closeButton.addEventListener("click", hidePopup);
}


// showPopup({title: "Notice", message: "This is a persistent popup 11111."}, "positive",5);
// showPopup({title: "Notice", message: "This is a persistent popup 11111."}, "positive");
// showPopup({title: "Notice", message: "This is a persistent popup 11111."}, "negative");
// showPopup({title: "Notice", message: "This is a persistent popup 11111."}, "neutral");