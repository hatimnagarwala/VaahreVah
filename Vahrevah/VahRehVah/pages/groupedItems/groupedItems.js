(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var itemRenderer;

    var RecordType = Data.RecordType;

    ui.Pages.define("/pages/groupedItems/groupedItems.html", {
        // Navigates to the groupHeaderPage. Called from the groupHeaders,
        // keyboard shortcut and iteminvoked.
        navigateToGroup: function (key) {
          //  nav.navigate("/pages/groupDetail/groupDetail.html", { groupKey: key });
        },

        NatigateToAllVideos: function () {
            nav.navigate("/pages/VideosPage/VideosPage.html", "AllGroups");
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            document.getElementById("BottAppDiv1").addEventListener("click", filter, false);
            document.getElementById("TopAppDiv6").addEventListener("click", postflyout, false);
            document.getElementById("TopAppDiv7").addEventListener("click", askflyout, false);
            document.getElementById("TopAppDiv5").addEventListener("click", AllVideos, false);

            var listView = element.querySelector(".groupeditemslist").winControl;
            var listView1 = element.querySelector(".groupeditemslist1").winControl;
            var listView2 = element.querySelector(".groupeditemslist2").winControl;
            var listView3 = element.querySelector(".groupeditemslist3").winControl;

            var CuisineListView = element.querySelector(".CuisineList").winControl;
            var InternationalCuisineListView = element.querySelector(".InternationalList").winControl;

            listView.groupHeaderTemplate = element.querySelector(".headertemplate");
            listView.itemTemplate = element.querySelector(".itemtemplate");
            listView1.groupHeaderTemplate = element.querySelector(".headertemplate");
            listView1.itemTemplate = element.querySelector(".itemtemplate1");
            listView2.groupHeaderTemplate = element.querySelector(".headertemplate");
            listView2.itemTemplate = element.querySelector(".itemtemplate2");
            listView3.groupHeaderTemplate = element.querySelector(".headertemplate");
            listView3.itemTemplate = element.querySelector(".itemtemplate3");

            listView.oniteminvoked = this._itemInvoked.bind(this);
            listView1.oniteminvoked = this._itemInvoked.bind(this);
            listView2.oniteminvoked = this._itemInvoked.bind(this);
            listView3.oniteminvoked = this._itemInvoked.bind(this);

            CuisineListView.itemTemplate = element.querySelector(".CuisineitemTemplate");
            InternationalCuisineListView.itemTemplate = element.querySelector(".InternationalCuisineitemTemplate");

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

            listView2.addEventListener("keydown", function (e) {
                if (appView.value !== appViewState.snapped && e.ctrlKey && e.keyCode === WinJS.Utilities.Key.g && e.altKey) {
                    var data = listView.itemDataSource.list.getAt(listView2.currentItem.index);
                    this.navigateToGroup(data.group.key);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }.bind(this), true);


            listView3.addEventListener("keydown", function (e) {
                if (appView.value !== appViewState.snapped && e.ctrlKey && e.keyCode === WinJS.Utilities.Key.g && e.altKey) {
                    var data = listView.itemDataSource.list.getAt(listView3.currentItem.index);
                    this.navigateToGroup(data.group.key);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }.bind(this), true);

            this._initializeLayout(listView, listView1, listView2, listView3, CuisineListView, InternationalCuisineListView, appView.value);

            listView.element.focus();
            listView1.element.focus();
            listView2.element.focus();
            listView3.element.focus();
        },

        getGroupInfo: function (group) {
            return {
                enableCellSpanning: true,
                cellWidth: 1 + 10,
                cellHeight: 1 + 10
            }
        },

        getItemInfo: function (idx) {

            var size = {
                width: 225,
                height: 525,
                newColumn: false
            };
            var data = Data.items._dataSource.itemFromIndex(idx)._value;

            if (data != undefined) {
                switch (data.data.recordType) {
                    case RecordType.LatestRecipeVideos1:
                        size.width = 225;
                        size.height = 525;
                        break;
                    case RecordType.LatestRecipeVideos2:
                        size.width = 225;
                        size.height = 525;
                        break;
                }

            }
            return size;
        },

        selectItemTemplate: function (itemPromise, recycle) {
            return itemPromise.then(function (item) {
                var data = item.data;

                var template = document.querySelector(".itemtemplate").winControl;
                if (data.recordType === RecordType.LatestRecipeVideos1) {
                    template = document.querySelector(".LatestRecipeVideos1").winControl;
                }
                else if (data.recordType === RecordType.LatestRecipeVideos2) {
                    template = document.querySelector(".LatestRecipeVideos2").winControl;
                }

                return template.render(item.data);;
            });
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
                   
                    this._initializeLayout(listView,  viewState);
                }
            }
        },

        // This function updates the ListView with new layouts
        _initializeLayout: function (listView, listView1, listView2, listView3, CuisineListView, InternationalCuisineListView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />
            listView.itemDataSource = Data.items.dataSource;
            if (viewState === appViewState.snapped) {
                listView.itemDataSource = Data.groups.dataSource;
                listView.itemTemplate = document.querySelector(".itemtemplate");
                listView.groupDataSource = null;
                listView.layout = new ui.ListLayout();
            } else {
                listView.groupDataSource = Data.groups.dataSource;
                listView.layout = new ui.GridLayout({
                    groupHeaderPosition: "top",
                    groupInfo: this.getGroupInfo.bind(this),
                    itemInfo: this.getItemInfo.bind(this)
                });

                listView.itemTemplate = this.selectItemTemplate.bind(this);

                listView1.itemDataSource = FeaturedVideosData.items.dataSource;
                listView1.groupDataSource = FeaturedVideosData.groups.dataSource;
                listView1.layout = new ui.GridLayout({ groupHeaderPosition: "top" });

                listView2.itemDataSource = BlogsData.items.dataSource;
                listView2.groupDataSource = BlogsData.groups.dataSource;
                listView2.layout = new ui.GridLayout({ groupHeaderPosition: "top" });

                listView3.itemDataSource = FeaturedRecipesData.items.dataSource;
                listView3.groupDataSource = FeaturedRecipesData.groups.dataSource;
                listView3.layout = new ui.GridLayout({ groupHeaderPosition: "top" });

                CuisineListView.itemDataSource = CusineListDATA.items.dataSource;
                CuisineListView.layout = new ui.ListLayout();

                InternationalCuisineListView.itemDataSource = InternationalCusineListdata.items.dataSource;
                InternationalCuisineListView.layout = new ui.ListLayout();
            }
        },

        _itemInvoked: function (args) {
            if (appView.value === appViewState.snapped) {
                // If the page is snapped, the user invoked a group.
                var group = Data.groups.getAt(args.detail.itemIndex);
                this.navigateToGroup(group.key);
            } else {
                // If the page is not snapped, the user invoked an item.
                var item = Data.items.getAt(args.detail.itemIndex);
                nav.navigate("/pages/RecipeDetail/RecipeDetail.html", { item: Data.getItemReference(item) });
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

    function videasdoflyout() {
        nav.navigate("/pages/VideosPage/VideosPage.html", "AllGroups");
    }

    function AllVideos() {
        nav.navigate("/pages/VideosPage/VideosPage.html", "AllGroups");
    }

    
})();
