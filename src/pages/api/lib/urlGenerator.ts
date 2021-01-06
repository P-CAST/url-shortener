import initialisedDB from '../../../handlers/firebase-admin'
import cryptoRandomString from "crypto-random-string";
import {NextApiRequest, NextApiResponse} from "next";

export const URLgen = async (urlInput: string) => {
    let randomId: string = cryptoRandomString({length: 4,type: "alphanumeric"})
    let output: {status: string,shortURL: string} = {status:'failed' , shortURL: ''}

    const db = initialisedDB.collection("locations")
    let validity = await db.where('target','==',urlInput).get()
    if (validity.empty) {
        // perform generation
        let targetDoc = await db.doc(randomId).get()
        while (targetDoc.exists) {
            randomId = cryptoRandomString({length: 4,type: "alphanumeric"})
            targetDoc = await db.doc(randomId).get()
        }
        await db.doc(randomId).set({target: urlInput})
        output.shortURL = `https://r.tucm.cc/${randomId}`
        output.status = 'success'
        return output

    }else{
        // pull existed record
        output.shortURL = `https://r.tucm.cc/${validity.docs[0].id}`
        output.status = 'success'
        return output
    }
}

