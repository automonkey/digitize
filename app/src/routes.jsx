import {Route, Routes} from "react-router-dom";
import paths from "./paths";
import DocumentUploadComponent from "./DocumentUploadComponent";
import Login from "./Login";
import DropboxAuthComponent from "./DropboxAuthComponent";
import AuthenticatedLayout from "./AuthenticatedLayout";
import React from "react";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AuthenticatedLayout />}>
                <Route path={paths.documentUpload} element={<DocumentUploadComponent />}/>
            </Route>
            <Route path={paths.login} element={<Login />}/>
            <Route path={paths.dropboxAuthToken} element={<DropboxAuthComponent />}/>
        </Routes>
    );
}
