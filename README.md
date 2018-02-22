# Trip Planner

### Introduction and Project Goals

When traveling, people often want to know what restaurants and points of interest there are to visit in the places they visit. To make this task easier, it would be helpful to create a single platform where the user can search for their flights and also get to see points of interest at their destination. Introducing our web application… the Trip Planner!

Trip Planner is a web application to help design and plan your next vacations. Customize your ideal vacation through personalizing your trips from start to finish. Choose from your favorite airlines, destinations, and restaurants. Discover new restaurants and filter through them based on different criteria. Take the opportunity to hear what others are saying about local places. Be your own personal trip advisor.

**The webpage [template](https://www.w3schools.com/w3css/tryw3css_templates_parallax.htm ) and CSS files provided by w3schools was used to develop the UI and frontend.

### Basic Architecture

Oracle SQL Server (AWS)
	An instance of AWS hosted our Oracle SQL Server, which contains the business and flight information for our project.

MongoDB (local)
	Login information was stored in a MongoDB database, and access to the database was through mongoose in the Node.js app. This was the NoSQL component of our project.

Data cleaning/processing
Python 3.6 (as part of the Anaconda package) was used as the primary tool for data cleaning. business.json was imported into a pandas dataframe, and was cleaned by index slicing. The business_hours table was created from the resulting business dataframe, also in Python.

For our web platform, we used HTML, CSS, Bootstrap, EJS, and Node.js, and Express to create our frontend while we used MySQL for our relational database and MongoDB/Mongoose for the NoSQL component for the backend.

### Key Features

Users are first presented with a homepage that has a short description of the goals of the app. The user can scroll down to click “Get Started” to create an account or choose Log In or Create Account from the taskbar at the top. 

The user can sign up to use our platform. For users who have already registered, they can sign in with their credentials to access the platform. Appropriate error checking for if an account is already associated with an email when creating an account or an incorrect email or password is used to log in. 

When logged in, the user can select from two options: those who have a specific itinerary in mind can choose option 1: “I have an itinerary ” or for those who don’t, they can choose option 2: “I’m feeling adventurous”.
For those choosing option 1, they can input their departure city (i.e. their current location) and their desired destination to see all flights available for their travel.

The user can view all information about the available airlines, including airline name, name of airport in departing city and name of the airport in arriving city.

The user can view informations in either source or destination city by selecting one of the two options under “See businesses located in” found on the same page.

The user can view all businesses located in this city including detailed information about the name, adress, rating, review count of the business.

For the name, rating, and review count columns, the user can sort the rows by any of the three columns by clicking on the arrows in the header.

To learn more about specific points of interests, the user can click the business name after which a pop-up will appear that displays the address, star rating, and operating hours of the business organized by the days of the week.

For users with dietary preferences, they can choose to filter the results for vegetarian, vegan, or kosher options.

The user can click on “Is Open” to input times to filter through businesses that are open at their desired time. 

For users without an itinerary in mind, they can choose option 2, where they can input their current city to view the highest-rated businesses that are reachable (i.e. have flights originating from their source city) from their current city.

Users can click on a contact page to see details about the databases and the developers. The taskbar also includes a logout option and the option to return to the welcome page that user sees when the first log in to the app.

### Technical Challenges

Setting up

Most of the technical challenges that we encountered with our project happened during initial setup. We encountered a lot of technical issues with getting the SQL RDS instance up and running. While creating the actual database itself wasn’t difficult, we struggled to actually connect to it since connecting required setting up additional security groups that would allow for us to connect from outside computers.

We encountered another major challenge when attempting to connect to our Amazon RDS Oracle Database from Node JS. There was a struggle to get the Node JS oracledb package setup. There are a lot of applications that are required just to use the oracledb package and the instructions that we found online had holes that we had to debug ourselves.

Yelp Reviews

We were unable to incorporate Yelp reviews into our project. The review.json file was very large (~3.7 GB), causing Python to take up all system memory and over 40 GB of swap space when we tried loading the review.json file into a pandas dataframe. Eventually, we resorted to mongoDB to store the reviews and came up with a query to fetch the longest 5 reviews for each business. Technical difficulties arose with connecting mongo db to Node.js app, but the instructions to create the relevant mongo db that work in the mongo shell so are as follow:

mongod
mongoimport --db yelp --collection reviews --drop --file "path\to\reviews.json"
mongoimport --db yelp --collection businessIDs --drop --file "path\to\business_ids.json"
mongo
use yelp
In place of "id" : "lhryYODlAmzQLZGkwmZ8wA", put the desired business_id:

db.businessIDs.find({"id":"lhryYODlAmzQLZGkwmZ8wA"}).map(function (d) { return db.reviews.find({ "business_id" : d.id }).toArray().sort(function(doc1, doc2) { return doc2.text.length - doc1.text.length }); })

This returns a javascript list of reviews, sorted in order of descending length of text.


### Description of Data

The Yelp dataset is provided by Yelp as an academic/educational tool, and includes a subset of the large number of businesses, reviews, and other metadata that Yelp tracks. Yelp provides this data in two forms: a .sql file which is a dump of the commands necessary to create and populate tables, and a collection of .json files which have a similar schema. We elected to use the .json files for the NoSQL component of our project.
The six .json files Yelp provides are business.json, review.json, user.json, checkin.json, tip.json, and photos.json. We focused on business.json and review.json.

### Data Cleaning
In order to clean business.json, we used Python 3.6. In particular, we first loaded the data into a pandas dataframe. Next, we filtered out businesses which were no longer open (is_open column).

Some of the columns were unusable, such as neighborhood, longitude, and latitude. Longitude and latitude were given only to 4 characters, meaning that most coordinates were to the nearest tenth of a degree. This corresponded roughly to distances on the order of 10 miles, and thus uninformative when trying to sort businesses by distance from airports.

Next, we required that valid businesses have non-null hours, address, city, and state. We dropped businesses without these attributes.

We required that the businesses of interest were food-related. This meant manually reading through the Yelp categories and picking out those which were food-related, and keeping only those businesses which fell into at least one of the chosen categories.

In order to make queries more easily written, we split the hours of a business by start time, end time, and day. The information on hours was originally in a single dict object associated with each business. We eventually made a separate table which had the business hours by day linked to the original businesses table by business_id. Once these tasks were completed, we dumped the database into a .sql file and uploaded the data to our Oracle SQL Server AWS instance.

The OpenFlights dataset was already in a MySQL database, from our initial two homeworks, and thus we simply dumped the database into a .sql file and uploaded to the server. The OpenFlights dataset was split into airports, airlines, and routes, with routes connecting airlines (by airline_id) to airports (by IATA source_id and destination_id).

### Combining Datasets
The single field in common between the OpenFlights data and the Yelp data was “city” parameter-- thus, the queries which involved both datasets were joined on “city”.
Performance Evaluation
	
The following scripts were evaluated on the AWS instance of the Oracle SQL database, using Oracle SQL Developer to log times.

### Query 1

Is there a route from source location city SOURCE_CITY to destination location city DESTINATION_CITY? (Query requires filling in strings for :source_city and :destination_city)

SELECT al.airline_id, al.airline_name, r.source_id,
    sa.airport_name AS source_airport, r.destination_id,
    da.airport_name AS destination_airport 
FROM routes r JOIN airlines al ON r.airline_id = al.airline_id
    JOIN airports sa ON r.source_id = sa.airport_id
    JOIN airports da ON r.destination_id = da.airport_id
WHERE r.source_id in (SELECT DISTINCT airport_id
    FROM airports
    WHERE city = :source_city)
AND r.destination_id in (SELECT DISTINCT airport_id
    FROM airports
    WHERE city = :destination_city);


Timings: 3 fetched in 0.118 s, 0.176 s, 0.116 s, with indices on routes.source_id and routes.destination_id. 0.153 s, 0.149 s, 0.187 s without. In everyday experience, airline routes do not change frequently, and airport ids will almost never change. Source_id and destination_id are relatively safe targets to index for routes.

### Query 2

What are the highest rated (rating of 4 or greater) businesses at the destination with a certain number of reviews? (Query requires filling in a string for DESTINATION_CITY and number for MIN_REVIEWS)

SELECT city, business_id, name, stars, review_count
FROM businesses
WHERE stars >= 4.0 AND city = :city AND review_count > 3
ORDER BY stars DESC, review_count DESC;

Timing: 1.170 s, 1.269 s, 1.068 s with index on stars. 4.879 s, 2.462 s, 4.942 s without. The number of stars can change, though we expect it wouldn’t change too quickly. This index is probably not as good as the ones for routes.

If the minimum review count is changed to 100, the timings become: 0.078 s, 0.076 s, 0.081 s.


### Query 3

What are the business hours for a specific business in order of Sunday-Saturday? (Query requires filling in a business id for :id)

SELECT *
FROM businesses NATURAL JOIN business_hours
WHERE business_id = :id
ORDER BY CASE WHEN Day = 'Sunday' THEN 1 WHEN Day = 'Monday' THEN 2 WHEN Day = 'Tuesday' THEN 3 WHEN Day = 'Wednesday' THEN 4 WHEN Day = 'Thursday' THEN 5 WHEN Day = 'Friday' THEN 6 WHEN Day = 'Saturday' THEN 7 END ASC, OPEN_HOUR ASC;

Timings: 7 in 0.150 s, 0.165 s, 0.154 s, with business id '_ANM7INCSWVJ8_dQxEWKZg'. There is no difference when adding business_hours.day as an index.


### Query 4

What businesses are open on a specific day and time in a specific city? (Query requires filling in a string for CITY, DAY, HOUR, and MINUTE)

SELECT b.name, b.address, b.city, h.open_hour, h.open_minute, h.close_hour, h.close_minute
FROM businesses b NATURAL JOIN business_hours h
WHERE ((h.open_hour < :hour) OR (h.open_hour = :hour AND h.open_minute <= :minute)) AND
((h.close_hour > :hour) OR (h.close_hour = :hour AND h.close_minute >= :minute)) AND h.day = :day AND b.city = :city;

Timings: 4008 results in 5.264 s, 3.059 s, 7.396 s, without indexing on day for business_hours. 3.241 s, 1.932 s, 2.469 s. Since this query takes the longest and indexing cuts the time roughly in half, this is a good candidate for indexing.

### Query 5

What restaurants have vegetarian options in city CITY? (Query required filling in a string for CITY)

SELECT name, address, city, postal_code
FROM businesses
WHERE city = :city AND vegetarian = 'TRUE';

Timings: 113 fetched in 0.036 s, 0.034 s, 0.032 s. Improvements to this would likely be negligible.


### Query 6

What are the highest rated businesses in each city reachable from source CITY?

(Query requires filling in a string for CITY)
WITH relevant_businesses AS (SELECT DISTINCT sa.airport_name AS source_airport, sa.city AS source_city,
da.airport_name AS destination_airport, da.city AS destination_city,
b.name AS business_name, b.stars AS stars
FROM routes r JOIN airports sa ON r.source_id = sa.airport_id
JOIN airports da ON r.destination_id = da.airport_id
JOIN businesses b ON b.city = da.city
WHERE sa.city = :city),
best_businesses AS (SELECT destination_city, MAX(stars) AS max_stars
FROM relevant_businesses
GROUP BY destination_city)
SELECT rb.*
FROM relevant_businesses rb, best_businesses bb
WHERE rb.destination_city = bb.destination_city AND rb.stars = bb.max_stars
ORDER BY rb.destination_city, rb.stars;

Timings: 651 fetched in 0.237 s, 0.220 s, 0.225 s.
Potential Future Extensions

### Future Directions

Yelp API

In the creation of this app, only the data available in Yelp’s dataset challenge were used. As a result, 700 select cities can be found in our database. The first obvious step would be to acquire Yelp’s entire database, or perhaps to query Yelp using its API directly for businesses of possible interest. Additionally, this would have allowed us to import user data to tailor recommendations.

Google Maps API

Another possible feature would be to use the Google Maps API to help order businesses by distance from the starting location requested by the user. The Yelp data only includes longitudes and latitudes up to 4 characters, meaning that for businesses in the US (latitude > 10), the vertical accuracy is only to the nearest tenth of a degree. This corresponds to roughly 7 miles, which is far from ideal. 

Social Media Integration

For a more tailored user experience, a travel diary or travel vlog incorporated into one’s profile could enhance personalization and make the web application more user tailored. Searching for other users on the web application and making the web application as more of a social media platform as well as a trip planner would also be an interesting possible future extension. More user options to add a bio and create a more detailed profile would also incorporate the site as a more fun social media platform as well as a utilitarian and helpful platform. Likewise, login to relevant social media such as Instagram, Facebook, and Twitter would also help to enhance the app and bring interest to the app from friends across different social media. 

### Screenshots

![p1](https://user-images.githubusercontent.com/22601709/36564905-e1184c80-17ec-11e8-9f39-f0cd63a1752b.png)
![p2](https://user-images.githubusercontent.com/22601709/36564928-fc9bf736-17ec-11e8-9e1d-286797260682.png)
![p3](https://user-images.githubusercontent.com/22601709/36564930-fcb4f9ac-17ec-11e8-9208-6f0fa35b8c35.png)
![p4](https://user-images.githubusercontent.com/22601709/36564931-fcf96894-17ec-11e8-8121-b28632f0ff91.png)
![p5](https://user-images.githubusercontent.com/22601709/36564932-fd1643c4-17ec-11e8-8b22-a725fe8bf6dd.png)
![p6](https://user-images.githubusercontent.com/22601709/36564934-fd370eba-17ec-11e8-853f-31bb9b3d5fb8.png)
![p7](https://user-images.githubusercontent.com/22601709/36564935-fd665738-17ec-11e8-8b5f-8ec7c8a232cc.png)
![p8](https://user-images.githubusercontent.com/22601709/36564936-fd8aa278-17ec-11e8-8245-24a9e8c247ed.png)
![p9](https://user-images.githubusercontent.com/22601709/36564937-fd9ab334-17ec-11e8-8183-aa412a87cb59.png)
![p10](https://user-images.githubusercontent.com/22601709/36564938-fdbdb23a-17ec-11e8-8f28-a0e41f1fe3f2.png)
![p11](https://user-images.githubusercontent.com/22601709/36564939-fdceafea-17ec-11e8-8fce-93142e4e33e2.png)
![p12](https://user-images.githubusercontent.com/22601709/36564940-fde9debe-17ec-11e8-9e96-6756f025741d.png)
![p13](https://user-images.githubusercontent.com/22601709/36564941-fe050da6-17ec-11e8-80cd-1b6ad63caf89.png)
![p14](https://user-images.githubusercontent.com/22601709/36564942-fe101598-17ec-11e8-94e9-5b884020f079.png)
![p15](https://user-images.githubusercontent.com/22601709/36564943-fe1bc190-17ec-11e8-9d37-1407d37ee6de.png)
![p16](https://user-images.githubusercontent.com/22601709/36564944-fe2872be-17ec-11e8-9697-6e62a032820e.png)
![p17](https://user-images.githubusercontent.com/22601709/36564945-fe635492-17ec-11e8-9d34-71e0173fd37e.png)
![p18](https://user-images.githubusercontent.com/22601709/36564946-fe6f6d9a-17ec-11e8-82b6-741396dbd77d.png)
![p19](https://user-images.githubusercontent.com/22601709/36564947-fe78a4be-17ec-11e8-924a-28e5a6ed7d00.png)
![p20](https://user-images.githubusercontent.com/22601709/36564948-fe80a772-17ec-11e8-8542-2f119b7675c6.png)
![p21](https://user-images.githubusercontent.com/22601709/36564949-fe8aacd6-17ec-11e8-870b-e7ff3136c12e.png)
![p22](https://user-images.githubusercontent.com/22601709/36564950-fe956cde-17ec-11e8-9b45-ed40238df352.png)
![p23](https://user-images.githubusercontent.com/22601709/36564951-fea3fbb4-17ec-11e8-8e52-585dcdcb687f.png)
![p24](https://user-images.githubusercontent.com/22601709/36564952-feb50792-17ec-11e8-8801-cdd6b8621aad.png)
![p25](https://user-images.githubusercontent.com/22601709/36564953-fec29358-17ec-11e8-8481-cf6e9a8f4293.png)
