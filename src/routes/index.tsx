import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "@/components/layout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
    </Route>
  )
);
