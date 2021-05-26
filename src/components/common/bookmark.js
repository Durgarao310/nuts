import React, { useState, useEffect, useCallback } from 'react';
import { MENUITEMS } from '../../components/common/sidebar-component/menu';
const Bookmark = () => {
    const mainmenu = MENUITEMS;
    const [openSearch, setOpenSearch] = useState(false);
    const [bookmarkItems, setBookmarkItems] = useState([]);
    // eslint-disable-next-line
    const [targetName, setTargetName] = useState('');

    const toggle = targetName => {
        if (!targetName) {
            setTargetName({
                ...targetName,
                targetName: {
                    tooltipOpen: true
                }
            });
        } else {
            setTargetName({
                ...targetName,
                targetName: {
                    tooltipOpen: !targetName.tooltipOpen
                }
            });
        }
    };

    const escFunction = useCallback((event) => {
        // eslint-disable-next-line
        if (event.keyCode == 27) {
            //Do whatever when esc is pressed
            setSearchValue('')
            setSearchResult([])
            setOpenSearch(false)
            document.querySelector(".filled-bookmark").classList.remove('is-open');
            document.querySelector(".page-wrapper").classList.remove("offcanvas-bookmark");
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        mainmenu.filter(menuItems => {
            if (menuItems.bookmark) {
                setBookmarkItems(bookmarkItems => [...bookmarkItems, menuItems])
            }
            return 0;
        });

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction , mainmenu]);

    const handleSearchKeyword = (keyword) => {

        keyword ? addFix() : removeFix()
        const items = [];
        setSearchValue(keyword)
        // eslint-disable-next-line
        mainmenu.filter(menuItems => {
            if (menuItems.title.toLowerCase().includes(keyword) && menuItems.type === 'link') {
                items.push(menuItems);
            }
            if (!menuItems.children) return false
            // eslint-disable-next-line
            menuItems.children.filter(subItems => {
                if (subItems.title.toLowerCase().includes(keyword) && subItems.type === 'link') {
                    subItems.icon = menuItems.icon
                    items.push(subItems);
                }
                if (!subItems.children) return false
                // eslint-disable-next-line
                subItems.children.filter(suSubItems => {
                    if (suSubItems.title.toLowerCase().includes(keyword)) {
                        suSubItems.icon = menuItems.icon
                        items.push(suSubItems);
                    }
                })
            })
            checkSearchResultEmpty(items)
            setSearchResult(items);
        });
    }

    const checkSearchResultEmpty = (items) => {
        if (!items.length) {
            document.querySelector(".empty-bookmark").classList.add('is-open');

        } else {
            document.querySelector(".empty-bookmark").classList.remove('is-open');
        }
    }

    const addFix = () => {
        document.querySelector(".filled-bookmark").classList.add('is-open');
        document.querySelector(".page-wrapper").classList.add("offcanvas-bookmark");
    }

    const removeFix = () => {
        setSearchValue('')
        setSearchResult([])
        document.querySelector(".filled-bookmark").classList.remove('is-open');
        document.querySelector(".page-wrapper").classList.remove("offcanvas-bookmark");
    }

    const addToBookmark = (event, items) => {
        const index = bookmarkItems.indexOf(items);
        // eslint-disable-next-line
        if (index == -1 && !items.bookmark) {
            items.bookmark = true;
            event.currentTarget.classList.add('starred');
            setBookmarkItems([...bookmarkItems, items])
        } else {
            event.currentTarget.classList.remove('starred');
            bookmarkItems.splice(index, 1);
            setBookmarkItems(bookmarkItems)
            items.bookmark = false;
        }
    }

    const removeOffcanvas = () => {
        if (openSearch) {
            setSearchValue('')
            setSearchResult([])
            document.querySelector(".filled-bookmark").classList.remove('is-open');
            document.querySelector(".page-wrapper").classList.remove("offcanvas-bookmark");
        }
        setOpenSearch(!openSearch)
    }

    return (
        <div>
            <div className="col">
                <div className="bookmark pull-right">
                    <ul>
                
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Bookmark;