import {Route, Switch} from "react-router-dom";
import paths from "./paths";
import DocumentUploadComponent from "./DocumentUploadComponent";
import Login from "./Login";
import DropboxAuthComponent from "./DropboxAuthComponent";
import React from "react";

export const Routes = () => {
    return (
        <Switch>
            <Route exact path={paths.documentUpload} component={DocumentUploadComponent}/>
            <Route path={paths.login} component={Login}/>
            <Route path={paths.dropboxAuthToken} component={DropboxAuthComponent}/>
        </Switch>
    );
}
