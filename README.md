# EAD Lab Express

## How to run project

**NPM and NodeJS is needed to run the project, yarn is optional**

Since the server and client are both separate applications they will need to be
run separately

- Go into the server folder and run `npm install` or `yarn` to install package
  dependencies
- Run `yarn start`(for yarn) or `npm start` or `npm run start` (for NPM) to
  run the server
- In another terminal go into the client folder and run `npm install` or `yarn`
  to install package dependencies.
- Run `yarn start` (for yarn) or `npm start` or `npm run start` (for NPM) to
  run the client
- Navigate to `localhost:3000` to open the webpage.

## Server

Since the data being handled isn't on a database, I created my own way of
hanlding the colors data. An object was created to easily get a color rather
than looping through an array of colors. However, at the near the end of the lab
I realized I needed the index of the color as well to navigate through the
colors without knowing their ID. Therefore, looping through the object that
contained all the colors was required. The code was not updated to handle this
making the colorsIndex object redundant.

Functions were created to update, delete, get and make new colors. These colors
were created to make them re-usable and standarized through each use.

Routes were created for each resource endpoint and a controller was created for
each route. To handle multiple requests on the same colors data mutex were
needed. For example, a request could delete a color while another request could
come to get colors. This was lead to inconsistency. This was done to attempt to
make each request to the colors data ACID compliant.

To handle errors express' `next` function was used. It would pass a stringified
json object with the error. A function was used to create the error object to
stringify to ensure that when the error middleware created can expect the same
type of object when running JSON.parse on the error string it receives. The
error middleware handles all errors created from the controllers and will send
a response with the error message from each controller.

### Client

React was used to create the frontend, there are 5 pages: display, add, update,
remove and background.

The display page uses the GET endpoint on `/` to get all the colors.

The add page allows the user to fill in details for a new color. There is
validation on each input so the user will not be able to add a new color as
long as the validation fails. react-form-hook was used to created the form.
As the user enters rgb, hsl or hex string values, the code will convert the
value and update the other inputs. For example, when a valid hex string is
entered, the rgb and hsl inputs will update automatically.

A color editor component was created as update, remove and background page were
very similar in functionality. The color editor will look for the color index
from the cookies to load the initial color. Navigate through colors without
the color ID is done through the buttons underneath the color preview. The
number between the buttons represents the index value of the array on the
server. As the user clicks through it updates the inputs values with the
respective color.

The update page allows the user to get a color and upate any of the values
besides the color ID.

The remove page allows the user to remove a color. All inputs other than color
ID becomes readonly as they should not be allowed to update a color while in the
remove page.

The background page allows the user to go through the colors and update the
background color with a color they choose. All inputs besides color ID are also
readonly.

Any endpoint not handled by the front end will bring you to a 404 page.

To more easily handle cookies I decided to have an abstraction on them. To
handle cookies easier created an abstraction to make handling cookies like
handling objects. The cookies object was wrapped around a proxy to handle
the real cookie string. For example, when the backgroundColorIndex was updated
it also updates the `document.cookies`. On initial load the web app will try to
create the cookie object from the cookie, if no cookie exists then create a new
one with default values, if it does parse the cookie and create the cookie
object.
