
var specialItem = ["testpolicy","welcome","version","statistics"];


export function updateRoute(currentPerm, currentRole, routes) {
        if (currentPerm && currentRole) {
        //运行时修改路由

        disableAuthorized(routes);
        Object.keys(currentPerm).filter((permKey) => {
                let patt = /read/;
                return patt.test(permKey)
            }).map((perm) => {
            let newKey = perm.replace("_read","").trim();
            let authority = currentPerm[perm]
            enableAuthorized(routes, newKey, authority, currentRole);//routes, "user", 1,"admin"

        })
    }
}

function disableAuthorized(routes) {
    routes.forEach(( item ) => {
        if( item.routes ) disableAuthorized(item.routes)
        if( item.name && specialItem.indexOf(item.name) < 0 && item.path != "/" ) {
          item.authority = [];//初始化authority
        }
    })
}
function enableAuthorized(routes, authname, authority, currentRole) {
    let isSet = false;
    routes.forEach(( item ) => {
    
        if( item.routes ) {
            let sonItemRoutes = enableAuthorized(item.routes, authname, authority, currentRole);
            
            if( sonItemRoutes ) {
                if( Array.isArray(item.authority ) && item.authority == false) {
                    item.authority.push( currentRole );
                    isSet = true;
                }
                else if( !Array.isArray(item.authority ) && item.authority == undefined ) {
                    let authList = [ currentRole ];
                    item.authority = authList;
                    isSet = true;
                }
            }
        }

        if(item.name==authname && item.path != "/" && authority) {
            
            if(Array.isArray(item.authority)) {
                item.authority.push(currentRole);
                isSet = true;
            }
            else if(!Array.isArray(item.authority)) {
                let authList = [currentRole];
                item.authority = authList;
                isSet = true;
            }
        }
  })
  return isSet;
}