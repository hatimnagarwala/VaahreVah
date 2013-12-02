(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;


    ui.Pages.define("/pages/RecipeDetail/RecipeDetail.html", {
        // Navigates to the groupHeaderPage. Called from the groupHeaders,
        // keyboard shortcut and iteminvoked.
        navigateToGroup: function (key) {
         //   nav.navigate("/pages/groupDetail/groupDetail.html", { groupKey: key });
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            document.getElementById("BottAppDiv1").addEventListener("click", filter, false);
            document.getElementById("TopAppDiv6").addEventListener("click", postflyout, false);
            document.getElementById("TopAppDiv7").addEventListener("click", askflyout, false);
            document.getElementById("TopAppDiv").addEventListener("click", Home, false);
            document.getElementById("TopAppDiv5").addEventListener("click", AllVideos, false);

            var listView = element.querySelector(".groupeditemslist").winControl;
			var listView1 = element.querySelector(".groupeditemslist1").winControl;
            listView.groupHeaderTemplate = element.querySelector(".headertemplate");
            listView.itemTemplate = element.querySelector(".itemtemplate1");
			listView1.groupHeaderTemplate = element.querySelector(".headertemplate");
            listView1.itemTemplate = element.querySelector(".itemtemplate2");
            listView.oniteminvoked = this._itemInvoked.bind(this);

            // Set up a keyboard shortcut (ctrl + alt + g) to navigate to the
            // current group when not in snapped mode.
            listView.addEventListener("keydown", function (e) {
                if (appView.value !== appViewState.snapped && e.ctrlKey && e.keyCode === WinJS.Utilities.Key.g && e.altKey) {
                    var data = listView.itemDataSource.list.getAt(listView.currentItem.index);
                    this.navigateToGroup(data.group.key);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }.bind(this), true);


			 listView1.addEventListener("keydown", function (e) {
                if (appView.value !== appViewState.snapped && e.ctrlKey && e.keyCode === WinJS.Utilities.Key.g && e.altKey) {
                    var data = listView.itemDataSource.list.getAt(listView1.currentItem.index);
                    this.navigateToGroup(data.group.key);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }.bind(this), true);

            this._initializeLayout(listView, listView1, appView.value);
            listView.element.focus();
			 listView1.element.focus();
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".groupeditemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    this._initializeLayout(listView, viewState);
                }
            }
        },

        // This function updates the ListView with new layouts
        _initializeLayout: function (listView, listView1, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.itemDataSource = RecipeDetaildata.groups.dataSource;
                listView.groupDataSource = null;
                listView.layout = new ui.ListLayout();
            } else {
                listView.itemDataSource = RelatedRecipesData.items.dataSource;
                listView.groupDataSource = RelatedRecipesData.groups.dataSource;
                listView1.itemDataSource = ReviewData.items.dataSource;
                listView1.groupDataSource = ReviewData.groups.dataSource;
                listView.layout = new ui.GridLayout({ groupHeaderPosition: "top" });
				listView1.layout = new ui.GridLayout({ groupHeaderPosition: "top" });
            }
        },

        _itemInvoked: function (args) {
            if (appView.value === appViewState.snapped) {
                // If the page is snapped, the user invoked a group.
                var group = RecipeDetaildata.groups.getAt(args.detail.itemIndex);
                this.navigateToGroup(group.key);
            } else {
                // If the page is not snapped, the user invoked an item.
                var item = RecipeDetaildata.items.getAt(args.detail.itemIndex);
               // nav.navigate("/pages/itemDetail/itemDetail.html", { item: RecipeDetaildata.getItemReference(item) });
            }
        }
    });

    function filter() {
        WinJS.UI.SettingsFlyout.showSettings("Demo", '/pages/FilterPage/FilterPage.html');
    }

    function postflyout() {
        WinJS.UI.SettingsFlyout.showSettings("Post", '/pages/PostRecipePage/PostRecipePage.html');
    }

    function askflyout() {
        WinJS.UI.SettingsFlyout.showSettings("Askvahchef", '/pages/AskvahchefPage/AskvahchefPage.html');
    }

    function Home() {
        nav.navigate("/pages/groupedItems/groupedItems.html");
    }

    function AllVideos() {
        nav.navigate("/pages/VideosPage/VideosPage.html", "AllGroups");
    }
})();
