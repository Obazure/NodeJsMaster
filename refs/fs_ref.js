const fs = require('fs')
const path = require('path')

// // File System
// fs.mkdir(path.join(__dirname, 'notes'), err => {
//     if (err) throw new Error(err)
//
//     console.log('Folder is created')
// })

// fs.writeFile(
//     path.join(__dirname, 'notes', 'mynotes.txt'),
//     'Hello world!',
//     err => {
//         if (err) throw err
//         console.log('File is created')
//
//         fs.appendFile(
//             path.join(__dirname, 'notes', 'mynotes.txt'),
//             'From append file!',
//             err => {
//                 if (err) throw err
//                 console.log('File is appended')
//
//                 fs.readFile(
//                     path.join(__dirname, 'notes', 'mynotes.txt'),
//                     'utf-8',
//                     (err, data) => {
//                         if (err) throw err
//                         // without utf-8 it should be
//                         // console.log(Buffer.from(data).toString())
//                         // with utf-8
//                         console.log(data)
//                     }
//                 )
//             }
//         )
//     }
// )

fs.rename(
    path.join(__dirname, 'notes', 'mynotes.txt'),
    path.join(__dirname, 'notes', 'notes.txt'),
    err => {
        if (err) throw err
        console.log('File renamed')
    }
)

