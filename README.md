# CEF Search View Component

This component is to be used in conjunction with the CEF Search Gem.

## Important info regarding the component.

This is the generic pack file example for our components.

Once you have pulled this in via yarn (yarn add 'cef_component-name') please change the import name and from to the component name.

You will also need to wrap the javascript_pack_tag call with a class to match the component name,
for example component = cef_search-view, class = .cef_search-view.

```
import { render } from 'react-dom';
import React from 'react';
import SearchView from 'cef_search-view';
document.addEventListener('DOMContentLoaded', () => {
  if(document.querySelector(".search-view"))
  {
    const node = document.querySelector(".search-view");
    // get data attributes from div = const "constName" = node.getAttribute('data- "data name"');
    const config = {
      showSidebar: true,
      showHeader: true,
      showContent: true,
      showPagination: true,
      searchTerm: "",
      sidebarType: "filters || categories",
    };
    render(
      <SearchView config={config} />,
      document.querySelector(".search-view")
    );
  }
});
```
