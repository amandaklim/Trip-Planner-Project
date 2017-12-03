# Social Network: Fakebook 

Web application that uses Mongoose, MongoDb, and EJS in Node.js and Express.js to make a pseudo social network. 

## Features

1. Create an account with an email and password

2. Log in to an existing account with the appropriate email and password

3. Add and delete friends

4. Add posts 
- Can add post on home feed or add post when on user's own profile

5. Add and delete interests

6. View user's own profile
- Shows user's friends, list of user's posts, and list of user's interests
- Ability to add post

7. View a custom home feed based on friends
- Has user's own posts and friends' posts
- Ability to add post

8. Only view the profiles of friends 
- Can view friends, posts, and interests of a friend's profile
- When accessing a profile of someone a user is not friends with, the user may only view a list of friends

9. Friend suggestions
- Shows number of mutual friends and/or number of interests in common
- Based on number of mutual friends and/or number of interests in common

10. Interests suggestions
- Shows number of friends that like each interest suggestion
- Based on friends' interests


## To execute the program
1. Have MongoDB installed. If you do not, navigate [here](https://docs.mongodb.com/master/administration/install-community/) and follow the instructions.
2. Make sure to have `$ mongod` running in another terminal.
3. In another window of the terminal, execute the following command-line bash `$ npm install` in the root directory of the project.
4. Next, execute `$ npm start`
5. Navigate to `http://localhost:3000` on your browser. 

## User Manual

1. Main page that appears when you first navigate to http://localhost:3000

<img width="743" alt="picture1" src="https://user-images.githubusercontent.com/22601709/27989764-f691a9e6-640d-11e7-88ff-3dbe8f7ba684.png">

2. When you click "Login" you get taken to the following:

<img width="747" alt="picture2" src="https://user-images.githubusercontent.com/22601709/27989736-8d8aea66-640d-11e7-8c01-1f89301e87de.png">

3. When you click "Create Account" you get taken to the following:

<img width="744" alt="picture3" src="https://user-images.githubusercontent.com/22601709/27989738-8d8dedd8-640d-11e7-9506-e02f6f1768ff.png">

4. When you log in to your account: You see a home page with your name, with a custom home feed that shows only your posts and your friend posts. You can add posts from your home page. You can get back to this page anytime by clicking “Home”. Registering for an account takes you to the same page but you will have no posts as you are a new user.

<img width="747" alt="picture4" src="https://user-images.githubusercontent.com/22601709/27989737-8d8d918a-640d-11e7-97f5-88414821ab0c.png">

5. When you click on “My Profile” you can view your profile, add posts, see your interests, and see your friends

<img width="747" alt="picture5" src="https://user-images.githubusercontent.com/22601709/27989739-8d906266-640d-11e7-89c7-fdc995cfc720.png">

6. Scrolling down on my profile: you can see your interests and your friends

<img width="757" alt="picture6" src="https://user-images.githubusercontent.com/22601709/27989740-8d917f8e-640d-11e7-882c-20f4280f2e85.png">

7. When you click on “My Friends” you see a list of your friends, and some interest suggestions (that are not part of your interests) that you may like based off of your friends’ interests

<img width="757" alt="picture7" src="https://user-images.githubusercontent.com/22601709/27989741-8d998e22-640d-11e7-997e-eb7f2fc47e2c.png">

8. When you click on a friend’s profile, you have the option to delete the friend. You can see the friends’ posts, their interests, and their friends. 

<img width="767" alt="picture8" src="https://user-images.githubusercontent.com/22601709/27989742-8d9d0dea-640d-11e7-8820-8f56175ee097.png">

9. Scrolling down on a friends’ page: you can see the rest of their interests and their friends

<img width="782" alt="picture9" src="https://user-images.githubusercontent.com/22601709/27989745-8da30b64-640d-11e7-85b5-476dedf4a426.png">

10. On the suggested friends page you can view friend suggestions (people you are not friends with) based on how many mutual friends you have with another person:

<img width="754" alt="picture10" src="https://user-images.githubusercontent.com/22601709/27989743-8da00fae-640d-11e7-8dd3-0afcb4d752b4.png">

11. On the view people with similar interests you can view people (who you are not friends with) with similar interests to you based on how many interests you have in common:

<img width="756" alt="picture11" src="https://user-images.githubusercontent.com/22601709/27989744-8da2fd9a-640d-11e7-8d31-58f022d3fe88.png">

12. When you click on someone’s profile that you are not friends with, you can only see an add friend button and their friends. 

<img width="756" alt="picture12" src="https://user-images.githubusercontent.com/22601709/27989746-8da38e9a-640d-11e7-80df-26b934a91b03.png">

13. When you add someone you aren’t friends with, the button changes to “Delete friend” and their posts and interests appear (their full profile). Their friends will still be available if you scroll down. You are now friends.

<img width="754" alt="picture13" src="https://user-images.githubusercontent.com/22601709/27989747-8da99b6e-640d-11e7-8693-cbefe2539cb8.png">

14. Scrolling down on your new friend’s profile, you will see that now you are part of their friends!

<img width="760" alt="picture14" src="https://user-images.githubusercontent.com/22601709/27989749-8db1b970-640d-11e7-91eb-520e93ff9662.png">

15. When you click on settings, you can add and delete your interests here.

<img width="756" alt="picture15" src="https://user-images.githubusercontent.com/22601709/27989748-8daf1008-640d-11e7-9be4-53c62222b814.png">

16. When you click “Logout” you are taken to the following page where you can login or create an account.

<img width="763" alt="picture16" src="https://user-images.githubusercontent.com/22601709/27989750-8db2b366-640d-11e7-9597-70485ddad7ae.png">
