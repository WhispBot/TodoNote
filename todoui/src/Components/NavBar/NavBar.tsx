import React, { FC, useState } from "react";
import styled from "styled-components";
import IToolbar from "../../Interfaces/navBar";
import { toast } from "react-toastify";
import { AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";

import NavItems from "./NavItems";
import DropDown from "./DropDown";
import { putReq } from "../../Api/function";
import { RootState } from "../../App/Store";
import { useDispatch, useSelector } from "react-redux";
import { updateText } from "../../features/todoSlice";
import { setIsOpen, setIsSaved, setSavedText } from "../../features/editorSlice";
import { selectTodo } from "../../features/selectedTodoSlice";

const Nav = styled.nav`
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: ${(props) => props.theme.navbar.backgroundcolor};
    border-bottom: ${(props) => props.theme.navbar.border};
    border-top: ${(props) => props.theme.navbar.border};
    height: 3em;
    color: ${(props) => props.theme.textcolor};
`;

const Ul = styled.ul`
    display: flex;
    align-items: center;
    justify-content: end;
    list-style: none;
    margin: 0;
    padding: 0;
`;

const Div = styled.div`
    display: flex;
    align-items: center;
    span {
        margin-left: 1em;
    }
`;

const NavBar: FC<IToolbar> = () => {
    const editor = useSelector((state: RootState) => state.editor.value);
    const selectedTodo = useSelector((state: RootState) => state.selectedTodo);

    const dispatch = useDispatch();

    const saveText = () => {
        if (!editor.isOpen) return;
        if (selectedTodo.value.id === 0) return;
        const newText = editor.text;
        const savedText = editor.savedText;
        if (newText === savedText) return;
        const updatedTodo = {
            id: selectedTodo.value.id,
            title: selectedTodo.value.title,
            isComplete: selectedTodo.value.isComplete,
            text: newText,
        };
        dispatch(setIsSaved(true));
        dispatch(selectTodo(updatedTodo));
        dispatch(setSavedText(newText));
        dispatch(updateText({ text: newText, index: selectedTodo.index }));
        putReq(selectedTodo.value.id, updatedTodo).then((data) => {
            toast(`${data.title} Saved! ✔️`);
        });
    };

    const checkIfCompleted = () => {
        if (selectedTodo.value.isComplete) {
        } else dispatch(setIsOpen(!editor.isOpen));
    };

    return (
        <Nav>
            <Div>
                <span>
                    {selectedTodo.value.title}
                    {editor.isSaved ? "" : " *"}
                </span>
            </Div>
            <Ul>
                <NavItems icon={<AiOutlineEdit />} onClick={() => checkIfCompleted()} />
                <NavItems icon={<AiOutlineSave />} onClick={() => saveText()} />
                <NavItems icon={<IoIosArrowDown />}>
                    <DropDown />
                </NavItems>
            </Ul>
        </Nav>
    );
};

export default NavBar;
