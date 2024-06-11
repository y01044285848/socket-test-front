import React, { useState, useRef, useEffect } from 'react'
import "@blocknote/core/fonts/inter.css";
import { Block } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

const EditorComponent = () => {


    const doc = new Y.Doc();
    const provider = useRef(null);
    

    useEffect(() => {
        // 컴포넌트가 마운트될 때 WebrtcProvider를 생성합니다.
        provider.current = new WebrtcProvider('test111111', doc, { signaling: ['ws://localhost:8080/testaa'] });
        // 컴포넌트가 언마운트될 때 provider를 정리합니다.
        return () => {
            provider.current.destroy();
        };
    }, []);
    
    const [blocks, setBlocks] = useState([]);

    const editor = useCreateBlockNote({
        defaultStyles: true,
        uploadFile: (file) => Promise.resolve(''),
        collaboration: {
            provider,
            fragment: doc.getXmlFragment("document-store"),
            user: {
                name: "My Username",
                color: "#ff0000",
            },
        },
    });

    const editorHandler = (e) => {
        console.log(e);
    }

    const editorSelectHandler = () => {
        const selection = editor.getSelection();
        if (selection !== undefined) {
            setBlocks(selection.blocks);
        } else {
            setBlocks([editor.getTextCursorPosition().block]);
        }
    }

    return (
        <div className='pageMain'>
            <BlockNoteView
                editor={editor}
                onSelectionChange={editorSelectHandler}
            />
            <div>Selection JSON:</div>
            <div className={"item bordered"}>
                <pre>
                    <code>{JSON.stringify(blocks, null, 2)}</code>
                </pre>
            </div>
        </div>
    )
}

export default EditorComponent