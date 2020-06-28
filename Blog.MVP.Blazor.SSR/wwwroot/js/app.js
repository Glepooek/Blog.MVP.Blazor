﻿(function (Oidc) {
    // ref to https://github.com/IdentityModel/oidc-client-js/blob/dev/samples/VanillaJS/public/code-identityserver-sample.js
    ///////////////////////////////
    // config
    ///////////////////////////////
    //Oidc.Log.logger = console;
    //Oidc.Log.level = Oidc.Log.DEBUG;

    var url = window.location.origin;
    console.log('root origin URL at ' + url);

    var settings = {
        authority: "https://ids.neters.club",
        client_id: "blazorjs",
        redirect_uri: url + '/callback',
        post_logout_redirect_uri: url,
        response_type: 'id_token token',
        scope: 'openid profile roles blog.core.api',

        popup_redirect_uri: url + '/callback',
        popup_post_logout_redirect_uri: url,

        silent_redirect_uri: url + '/silent',
        automaticSilentRenew: false,

        filterProtocolClaims: true,
        loadUserInfo: true,
        revokeAccessTokenOnSignout: true
    };
    var mgr = new Oidc.UserManager(settings);

    ///////////////////////////////
    // events
    ///////////////////////////////
    mgr.events.addAccessTokenExpiring(function () {

        // maybe do this code manually if automaticSilentRenew doesn't work for you
        mgr.signinSilent().then(function (user) {
            console.log("silent renew success", user);
        }).catch(function (e) {
            console.error("silent renew error", e.message);
        })
    });

    mgr.events.addAccessTokenExpired(function () {
        console.log("token expired");
    });

    mgr.events.addSilentRenewError(function (e) {
        console.log("silent renew error", e.message);
    });

    mgr.events.addUserLoaded(function (user) {
        console.log("user loaded", user);
        mgr.getUser().then(function () {
            console.log("getUser loaded user after userLoaded event fired");
        });
    });

    mgr.events.addUserUnloaded(function (e) {
        console.log("user unloaded");
    });

    ///////////////////////////////
    // functions for UI elements
    ///////////////////////////////

    window.users = {
        getUserInfo: function () {
            return mgr.getUser().then(function (user) {
                console.log("getUserInfo success");
                if (user === null) return {};
                
                var m = new Date();
                var expiretime = new Date(m.getTime() + 1000 * user.expires_in);
                console.log(expiretime);
                return {
                    accessToken: user.access_token,
                    tokenType: user.token_type,
                    scope: user.scope,
                    expireTimeTamp: Date.parse(expiretime),
                    profile: {
                        userId: user.profile.sub,
                        name: user.profile.name,
                        email: user.profile.email,
                        website: user.profile.website
                    }
                };
            }).catch(function (e) {
                console.error("getUserInfo error", e.message);
            });
        },
        startSigninMainWindow: function () {
            mgr.signinRedirect({ state: 'some data' }).then(function () {
                console.log("signinRedirect done");
            }).catch(function (err) {
                console.error(err);
            });
        },
        endSigninMainWindow: function () {
            return mgr.signinRedirectCallback().then(function (user) {
                console.log("signed in", user);
                return user;
            }).catch(function (err) {
                console.error(err);
            });
        },
        startSignoutMainWindow: function () {
            //mgr.signoutRedirect({ state: 'some data' }).then(function (resp) {
            mgr.signoutRedirect().then(function (resp) {
                console.log("signed out", resp);
            }).catch(function (err) {
                console.error(err);
            });
        },
        getUserInfoFromStorage: function () {
            return JSON.parse(localStorage['USER_INFO'] || "{}") || {};
        },
        setUserInfoToStorage: function (userInfo) {
            localStorage.setItem("USER_INFO", JSON.stringify(userInfo));
        },
        log: function (message) {
            console.log(message);
            return true;
        }
    }
})(Oidc);