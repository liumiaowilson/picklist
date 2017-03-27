## Simple PickList Based On Angular Js

1. This picklist accepts data of groups.json and features.json, and shows two multiple selection list with "move-to-left" and "move-to-right" buttons.

2. It is based on angularjs and bootstrap.

3. The json files are loaded using ajax calls, so a http server should be started to view the demo.

4. The UI of the picklist can accept immediate data of groups and features, or through firing events of "dataLoaded" after asynchronous ajax calls.

5. For the sake of demonstration, the data is persisted and loaded in the session storage through the exposed apis of the custom directive.

6. Simple test cases are run on karma and jasmine.
