# ReactJS: AirBrB: Online Listing Marketplace Frontend Project

## 1. Introduction

This project is closely modelled off the popular property renting platfrom [Airbnb](https://www.airbnb.com.au/). Mainly building a frontend for a provided backend. This frontend is built with ReactJS. It's a single page application that does not require a refresh for state updates.

Features implemented are listed below.

## 2. The Features
### 2.1. Feature Set 1. Admin Auth

This focuses on the basic user interface to register and log in to the site. Login and registration are required to gain access to making bookings as a guest, leave reviews and to manage user's own listings as a host.

#### 2.1.1. Login Screen
 * A unique route exist for this screen
 * User is able to enter their `email` and `password`.
 * If the form submission fails, a reasonable error message will be shown
 * A button that allows submission of form

#### 2.1.2. Register Screen
 * A unique route exist for this screen
 * User is able to enter their `email` and `password` and `name`
 * A confirm `password` field exist where user re-enters their password.
 * If the two passwords don't match, the user will receive an error popup before submission.
 * If the form submission fails, a reasonable error message will be shown.
 * A button exist to allow submission of form.

#### 2.1.3. Logout Button
 * A logout button, when clicked, returns user to the landing screen whilst being no longer logged in.

#### 2.1.4. Items on all screens
 * On all screens, for a user who is logged in / authorised:
   * The logout button exists somewhere
   * A button exists that will take the user to the screen to view their hosted listings.
   * A button exists that will take the user to the screen to view all listings.

### 2.2. Feature Set 2. Creating & Editing & Publishing a Hosted Listing

For logged in users, they are able to create their own listings (as a host) that will become visible to all other users who have the option of booking it.

#### 2.2.1. Hosted Listings Screen
* A unique route exist for this screen
* A screen of all of user's listings (that user created) is displayed, where each listing shows the:
	- Title
	- Property Type
	- Number of beds
	- Number of bathrooms
	- Thumbnail of the listing
	- SVG rating of the listing (based on user ratings)
	- Number of total reviews
	- Price (per night)
* Each listing has a clickable element relating to it that takes user to the screen to edit that particular listing.
* A button exists on this screen that allows user to delete a particular listing.

#### 2.2.2. Hosted Listing Create
* On the hosted listing screen a create listing button exists that allows user to create a new listing. When user click on it, user are taken to another screen that requires user to provide the following details:
	- Listing Title
	- Listing Address
	- Listing Price (per night)
	- Listing Thumbnail
	- Property Type
	- Number of bathrooms on the property
	- Property bedrooms (e.g. each bedroom could include number of beds and their type)
	- Property amenities
* Using a button, a new listing on the server is created and visibly added to the dashboard (the Hosted Listings Screen) once all of the required fields have been filled out correctly.

#### 2.2.3. Edit AirBrB Listing
* A unique route exists for this screen that is parameterised on the listing ID.
* The user should be able to edit the following: 
	- Title
	- Address
	- Thumbnail
	- Youtube link
	- Price (per night)
	- Type
	- Number of bathrooms
	- Bedrooms (incorporate editing of beds as part of bedrooms)
	- Amenities
* A save button exist to save the updates and return user to the hosted listings screen.

#### 2.2.4. Publishing a listing
 * For a listing to "go live" means that the listing becomes visible to other AirBrB users on the screen described in ``2.4``.
 * On the hosted listings screen described in ``2.2.1``, add the ability to make an individual listing "go live".


### 2.3. Feature Set 3. Landing Page: Listings and Search

When the app loads, regardless of whether a user is logged in or not, they can access the landing screen. The landing screen displays a number of listings that user as a guest may be able to book (on another screen). 

#### 2.3.1. Listings Screen
* A unique route exist for this screen.
* This is the default screen that is loaded when a user accesses the root URL.
* This screen displays a list of all published listings (rows or thumbnails). The information displayed in each listing is:
  * Title
  * Thumbnail of property (or video if user added)
  * Number of total reviews
* In terms of ordering of displayed published listings:
  * Listings that involve bookings made by the customer with status `accepted` or `pending` should appear first in the list (if the user is logged in).
  * All remaining listings should be displayed in alphabetical order of title.

#### 2.3.2. Search Filters
* On this listings screen, a search section exists for the user to filter via search parameters. user are only required to be able to search by one of the parameters described below at a time.
* The search section will consists of an input text box:
  * The input text box will take in a search string, and will search title and city location properties of listings, and only display those that match.
* Other form inputs should also exist that allow the user to search by:
	* Number of bedrooms (a minimum and maximum number of bedrooms, expressed either via text fields or a slider)
	* Date range (two date fields) - only display bookings that are available for the entire date range as inputted by the user.
	* Price (a minimum and maximum price, expressed either via text fields or a slider)
	* Review ratings:
		- Sort results from highest to lowest review rating **or** from lowest to highest review rating
* The search section has an associated search button that will action the search to reload the results given the new filters.

### 2.4. Feature Set 4. Viewing and Booking Listings

#### 2.4.1. View a Selected Listing
 * A unique route exist for this screen that is parameterised on the Listing ID.
 * For `2.3`, when a listing is clicked on, this screen should appear and display information about a specific listing.
 * On this screen the user is given the listing they have decided to view in 2.4.1. This consists of:
	- Title
	- Address
	- Amenities
	- Price
	- All images of the property including the listing thumbnail (they don't have to be visible all at once)
	- Type
	- Reviews
	- Review rating
	- Number of bedrooms
	- Number of beds
	- Number of bathrooms

#### 2.4.2. Making a booking and checking its status
 * On the screen described in `2.4.1`, a **logged in** user is able to make a booking for a given listing they are viewing between the dates they are after. The user enters two dates (this includes day, month and year), and assume the dates describe a valid booking, a button allows for the confirmation of the booking, and the total price will auto display above the datepicker.
 * A user can make an unlimited number of bookings per listing even on overlapping date ranges and even if other users have already booked the property for those dates. It is up to the host to check if they have double booked their listing and accept/deny the bookings accordingly.

#### 2.4.3 Leaving a listing review
* A logged in user is able to leave a review for listings they've booked that will immidiately appear on the listing screen after it's been posted by the user. The review will consist of a score (number) and a comment (text). user can leave an unlimited number of reviews per listing.
* Please note: Normally user'd prohibit reviews until after a booking visit is complete, but in this case for simplicity we allow reviews to be left as soon as a booking's status becomes `accepted`.
* If the user has made more than 1 booking for a given listing, user can use any of their `bookingid`s for the purpose of leaving a review. Just as long as the booking has status `accepted`.

### 2.5. Feature Set 5. Removing a Listing, Managing Booking Requests

#### 2.5.1. Removing a live listing
 * On the hosted listings screen described in `2.2.1`, add the ability to remove a live listing from being visible to other users. 
 * Once un-published, those who had made bookings for a removed listing will no longer be able to view it on their landing screen

#### 2.5.2. Viewing booking requests and history for a hosted listing
 * A unique route exist for this screen that is parameterised on the listing ID
 * This screen can be accessed via a button on the hosted listings screen.
 * On this screen, a list of booking requests are provided for the listing they are viewing. For each booking request, the host is able to accept/deny it.
 * The screen should also display the following information about a listing:
	* How long has the listing been up online
	* The booking request history for this listing consisting of all booking requests for this listing and their status (accepted/denied)
	* How many days this year has the listing been booked for
	* How much profit has this listing made the owner this year

### 2.6. Feature Set 6. Advanced Features

#### 2.6.1 Advanced Listing Rating Viewing
* On click of star rating a tool tip appears which displays the break down of how many people rated the booking (both in percentage terms and absolute terms) within each star category.
* If user click on a particular star rating, another screen should appear (that can be closed) that shows all of the individual reviews left for that rating.

#### 2.6.4 userTube Listing Thumbnail 
* For any given listing, user can use a Playable userTube video as the listing thumbnail. This usertube video URL becomes a field in the create/edit hosted listing screen.

### 2.8. Testing

As part of this project we wrote some tests for our components (component testing), and for our application as a whole (ui testing).

For **component testing**:
 * There are 6 tests for different components in test folder, coded by jest.
 * For each of the components, they don't have more than 50% similarity.

For **ui testing**:
 * "happy path" of an admin that is described as:
  1. Registers successfully
	2. Creates a new listing successfully
	3. Updates the thumbnail and title of the listing successfully
	4. Publish a listing successfully
	5. Unpublish a listing successfully
	6. Make a booking successfully
	7. Logs out of the application successfully
	8. Logs back into the application successfully
 * Conversely, the 'unhappy path' for an admin involves encountering issues or failures at each of these steps.


## 3. Run Application

### 3.1. The Frontend

Navigate to the `frontend` folder and run `npm install` to install all of the dependencies necessary to run the ReactJS app. Then run `npm start` to start the ReactJS app.

### 3.2. The Backend (provided)

After you clone this repo, you must run `npm install` in `backend` directory once.

To run the backend server, simply run `npm start` in the `backend` directory. This will start the backend.

To view the API interface for the backend you can navigate to the base URL of the backend (e.g. `http://localhost:5005`). This will list all of the HTTP routes that user can interact with.

If you want to reset the data in the backend to the original starting state, you can run `npm run reset` in the backend directory. If you want to make a copy of the backend data (e.g. for a backup) then simply copy `database.json`. If you want to start with an empty database, you can run `npm run clear` in the backend directory.

Once the backend has started, you can view the API documentation by navigating to `http://localhost:[port]` in a web browser.

The port that the backend runs on (and that the frontend can use) is specified in `frontend/src/config.js`. you can change the port in this file. This file exists so that your frontend knows what port to use when talking to the backend.


