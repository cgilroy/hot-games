# hot-games: Live Hockey Scores

[Check it out](http://cgilroy.github.io/hot-games)

This is a live-updating, responsive hockey score project (with no affiliation to the NHL in any way).

The NHL stats API is publicly accessible, and updated in real-time.  This project takes advantage of this data, and delivers it live in a light-weight format.

## Skills Developed
* React.js - project was bootstrapped using create-react-app
* CSS - styling and mobile responsiveness
* Node.js NPM - running build and test scripts on local server
    * [Moment](https://www.npmjs.com/package/moment) - parsing and manipulating dates/times
    * [React Transition Group](https://www.npmjs.com/package/react-transition-group) - animating data updates in components

## Known Issues
* The site can only be as good and accurate as the data it accesses from the API.  Sometimes the data will be missing, incorrect, or badly delayed, which often times can be attributed to data issues (separate from anything to do with this project).  Check the [NHL website](http://www.nhl.com) to see if the data issues match up.

## Project Conclusions
This was my first time working with React.js and I was able to branch out into many different areas.  Besides learning the ins and outs of React, I gained insight into lots of other web development skills such as webpack bundling, SVG image manipulation, and getting the hang of GIT.  I also tried out a number of different React libraries ([react-table](https://www.npmjs.com/package/react-table), [react-stack-grid](https://www.npmjs.com/package/react-stack-grid), [simplebar-react](https://github.com/Grsmto/simplebar)), though eventually opted to try and develop my own solutions; even if they didn't end up looking quite as nice.

### Acknowledgments
* [Drew Hynes](https://gitlab.com/dword4/) - great work documenting the NHL API
* Whoever is out there for the NHL logging this data (especially the location data for every event; that must be super tiresome)
* Design for the project was heavily inspired by the [Yahoo! StatTracker](https://sports.yahoo.com/nhl/gamechannel/)
