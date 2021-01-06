import Router from 'next/router'
import React from 'react';
import {GetServerSideProps} from 'next';
import initialiseDB from '../handlers/firebase-admin'

export const getServerSideProps: GetServerSideProps = async ({ params}) => {
    const db = initialiseDB.collection("locations").doc(params.URLid.toString())
    const URLbase = await db.get()
    let URLtarget: string
    if (URLbase.exists) {
        URLtarget = URLbase.get("target")
    }else{
        URLtarget = "error"
    }
    return {
        props: {target: URLtarget}
    }
}

const Page = ({ target }) => {
    React.useEffect(() => {
        if (target !== "error") {
            Router.push(target)
        }
    })
    if (target !== "error") {
        return (<p>Redirecting..</p>)
    }else{
        return (<p>Invalid link</p>)
    }
}

export default Page