# Welcome to Project1 - GAZETTEER

This is a Full Stack mobile friendly interactive map project created and implemented using JavaScript/Jquery(front-end) + PHP(backend). HTML/CSS used for desgin and Structure.

## Core Design

The main features implemented were the follwing:

● Render Map Correctly

● Render EasyButtons with distinct features correctly

● Render basemaps view correctly

● Current Location EasyButton views current location on map

● Information EasyButton views modal popup of information for current highlighted country

● Weather EasyButton implement markers which will have popup for live weather data

● Implement Wikipedia Icons for different area within highlighted country

[Data APi's] used:

● ("../data/countryBorders.geo.json") - utilised for extraction and presentation of country properties, information and geometry.

● ("../data/countryInfo.json") - utilised for extended country information

● ("http://data.fixer.io/api/latest?access_key=006d268d3dcc23e406cd02154c5130c9") - Used for Currency Exchange Rates

● (https://restcountries.eu/rest/v2/alpha/) - Used for addional Country features, pics and symbols

## Structure & Program Flow

Below is a brief description highlighting the devised solution.

● Main Tree Structure I went with:

|-- Libs (Hold all individual folders for CSS, JavaScript, Images, Data used and PHP - all used to assemble the project)
|-- Vendors (Hold all individual folders for CSS, JavaScript, Images, Data used - all third party tools used in the implementation)
|-- index.html - Holds Core Structure of page application / design
|-- .prettierrc - Config file for beautify code structure.
|-- PHP files read data from endpointsna dreturn json in objects to be manipulated.

● As seen above the index.html file holds the header section for main page title and sections tags to contain Leaflet Map, Modals, Buttons, Links to Stylesheets and JS Scripts (This is the backbone for holding data and loading elements systematically)

● The Data folder contains Geojson file which houses country data in as features and ultimately as a Feature Collection. PHP routines are set up to extract data as needed from the application in script.

● In getCountryData.php we are setting up a routine call using CURL to get geojson contents, saving urls to variable and objectifying custom structure for application to use. These are all output is seperate distinct variables. The script file checks if preloader is set and document.ready() ensures all CSS and Scripts are loadeded before code execution and page load. On top we have a loader animation before the map is displayed on the page.

The Script order is below:

● Declared Global Variables
● Added Tile Layers, basemaps and options for initial map view
● Called document.ready and initiated loader and added container fluid Bootstrap class for modern page styling
● Any Reusable functions are declared before the document ready to be purposely used through the program where needed
● Executed JavaScript Navigator function to retrieve Geolocation. Added custom marker and setup Current Location function with an ajax asynchronous call to php routine for Country Boundary data. This ensured that we conditionally set up to highlight bounds for the country the used is located in upon loading website (after the user is asked to give permission for the site to use location).
● Adding to ajax request we have retrieved bounds from geojson using Leaflet function and gave it custom styling and zoomed in to each Feature so its in map view for user. This is similar to many of the other ajax request used throught the script.
● Conditional statements are used to match geojson country feature iso_code to get correct country bounds for highlighting and manipulation. We eventually call the function. (Note Lat and Lng are calculated via L.LatLng function and saved to latlng to be used later)

● We have then utilised Easybuttons and set out three easybuttons:

1 - Takes user to current location view from anywhere around the map
2 - Information open modal dialog for information about selected highlighted Country
3 - Creates markercluster for weather points with in selected country boundary with open pop for customed weatherinfomation view that users can click to view.

Each EasyButton contains function which return ajax call requests -

● Current Location utilities the Current Location function described above to use Lat Lng from Navigator to view marker with popup for current location the user resides in.

● Information Easybutton utilises Leaflet pip library to point to country layer based on lat lng to identify correct country is selected and corresponding information displayed in modal.
● All modal information is conditionally rendered through looping over countryFeatures Geojson return data to check for correct country name and eventually populated modal information (In tabular format with classes set to each table data points)
● Here api return from PHP routines have been used to display correct information in table slots

● Weather Easybutton checks country code with Select tag country selected and essentially houses two main functions:
onClick - Renders weather markers that can be clicked to view weather api information
ajax request to weather api - Using the current lat and lng on mapview the markers displayed will have the property of popups and ajax request will populated the popup with decorated relavent weather information including weather icons for live weather in the state and full math calcs for relavent data. Finally upon ending ajax call the onClick will be excuted.
Markercluster layer has been created to justify 7 points to be populated within current bounds to provide live weather pop information to the user.

The Final two ajax calls are described below:

● After Completion of Navigator and Easybutton - still within document.ready() an ajax call is made to php countryData to appends country Name and Code to Select tag after conditionally filtering out data from the object.

● Final ajax call is on user selecting country from Select. Condition has been setup to match selected country name to CountryBorder code Object key and hence return relevent border and onto the mapview.

### Running the Website

#### Get the code

Fork the project from git which can be found [here](https://github.com/muhammad-shahroze/shahrozeBilal.git). Then copy the git url and in the appropriate folder on your machine:

```
git clone https://github.com/muhammad-shahroze/shahrozeBilal.git
```

This will create the project on your local machine. Open the project in VS code (or alternative app). Make sure that Project 1 is selected

## Running the app

To run the app:

Open index.html file form project folder or you can visit the live website link given below which is hosted on server.

Livesite Link: https://project1.shahrozebilal.co.uk/

## Authors

- **Muhammad Shahroze** - [muhammad-shahroze](https://github.com/muhammad-shahroze)

