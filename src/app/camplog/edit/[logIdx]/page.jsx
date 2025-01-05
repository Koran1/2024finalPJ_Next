"use client"
import { Box, Button, FormControl, Grid2, Input, InputLabel, MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useEffect, useRef, useState } from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ChevronLeft, ChevronRight, Search } from '@mui/icons-material';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import './page.css';

import CheckIcon from '@mui/icons-material/Check';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useRouter } from 'next/navigation';

function EditPage({ params }) {
    const router = useRouter();
    const logIdx = params.logIdx;
    const baseUrl = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
    
    // State variables
    const [extraFields, setExtraFields] = useState([]);
    const [originalFiles, setOriginalFiles] = useState([]);
    const fileRef = useRef({});
    const [tags, setTags] = useState([]);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showCampModal, setShowCampModal] = useState(false);
    const [LinkedCampIdx, setLinkedCampIdx] = useState("0");
    const [campData, setCampData] = useState([]);
    const [logTitle, setLogTitle] = useState("");
    const [logDefaultContent, setLogDefaultContent] = useState("");
    const [linkedItem, setLinkedItem] = useState([]);
    const [linkList, setLinkList] = useState([]);
    const [selectedDoNm2, setSelectedDoNm2] = useState("전체");
    const [dealKeyWord, setDealKeyWord] = useState("");
    const [campKeyWord, setCampKeyWord] = useState("");
    const [filteredCampList, setFilteredCampList] = useState([]);
    const [selectedCampIdx, setSelectedCampIdx] = useState(0);
    const [selectedDealIdx, setSelectedDealIdx] = useState(0);
    const [confirmedCampIdx, setConfirmedCampIdx] = useState(0);
    const [confirmedDealIdx, setConfirmedDealIdx] = useState(0);
    const [showCountForDealList, setShowCountForDealList] = useState(5);
    
    const limit = 6;
    const [nowPage, setNowPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const offset = (nowPage - 1) * limit;

    // Fetch existing log data
    useEffect(() => {
        const fetchLogData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/camplog/edit/${logIdx}`);
                if (response.data.success) {
                    const data = response.data.data;
                    
                    // Set initial states with existing data
                    setLogTitle(data.logVO.logTitle);
                    setLogDefaultContent(data.logContentVO[0].logContent);
                    setConfirmedCampIdx(data.campVO.campIdx);
                    setCampData([data.campVO]);
                    
                    // Handle existing files and content
                    const existingFields = data.fileVO.map((file, index) => ({
                        id: Date.now() + index,
                        file: null,
                        text: data.logContentVO[index + 1]?.logContent || "",
                        previewImg: `${imgUrl}/${file.fileName}`,
                        showOverlay: false,
                        isThumbnail: file.isThumbnail === 1,
                        originalFileName: file.fileName
                    }));
                    
                    setExtraFields(existingFields);
                    setOriginalFiles(data.fileVO);

                    // Handle existing tags
                    if (data.tagVO) {
                        const existingTags = data.tagVO.map(tag => ({
                            tagX: tag.tagX,
                            tagY: tag.tagY,
                            tagId: tag.tagId,
                            fieldID: existingFields[tag.fieldIdx - 1].id,
                            showContent: false,
                            text: tag.tagContent,
                            showModal: false,
                            fieldIdx: tag.fieldIdx,
                            dealIdx: tag.dealIdx,
                            nodeRef: React.createRef()
                        }));
                        setTags(existingTags);
                    }
                }
            } catch (error) {
                console.error("Error fetching log data:", error);
                alert("기존 글 정보를 불러오는데 실패했습니다.");
            }
        };

        fetchLogData();
    }, [logIdx]);

    // Validation function
    const iscanWrite = () => {
        if (logTitle.length === 0) return "noTitle";
        if (logDefaultContent.length === 0 && !extraFields.some(field => field.text.length > 0 || field.file !== null)) {
            return "noContent";
        }
        if (tags.some(tag => tag.text.length === 0)) return "emptyTag";
        return "ok";
    };

    // Handle update
    const handleUpdate = async () => {
        if (iscanWrite() !== "ok") {
            const messages = {
                noTitle: "제목을 입력해주세요",
                noContent: "내용을 입력해주세요.",
                emptyTag: "내용이 비어있는 태그가 존재합니다."
            };
            alert(messages[iscanWrite()]);
            return;
        }

        const updateData = {
            uvo: { userIdx: "1" }, // Replace with actual user ID
            cvo: { campIdx: confirmedCampIdx },
            lvo: { logTitle, logIdx },
            lcvo: {
                contentData: [
                    { logContent: logDefaultContent, logContentOrder: 0 },
                    ...extraFields.map((field, index) => ({
                        logContent: field.text,
                        logContentOrder: index + 1
                    })).filter(item => item.logContent !== "")
                ]
            },
            fvo: extraFields.map((field, index) => ({
                fileOrder: index + 1,
                isThumbnail: field.isThumbnail ? 1 : 0,
                isFileThere: field.file !== null || field.originalFileName !== undefined,
                originalFileName: field.originalFileName
            })),
            tvo: tags.map(tag => ({
                logIdx,
                fieldIdx: tag.fieldIdx,
                tagX: tag.tagX,
                tagY: tag.tagY,
                tagId: tag.tagId,
                dealIdx: tag.dealIdx,
                tagContent: tag.text
            }))
        };

        const formData = new FormData();
        formData.append("UpdateData", new Blob([JSON.stringify(updateData)], { type: "application/json" }));
        
        // Append only new files
        const newFiles = extraFields.filter(field => field.file).map(field => field.file);
        newFiles.forEach(file => {
            formData.append("mpFiles", file);
        });

        try {
            const response = await axios.put(`${baseUrl}/camplog/edit`, formData);
            if (response.data.success) {
                alert("수정이 완료되었습니다.");
                router.push(`/camplog/detail/${logIdx}`);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error updating log:", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    const handleFileBtn = (id) => {
        fileRef.current[id].click();
    }
    const handleDelField = (delId) => {
        if (confirm(" 작성했던 글과 사진이 사라집니다. 정말 삭제하시겠습니까?")) {
            setExtraFields(extraFields.filter((item) => item.id != delId));
        }
    }
    const handleFileChange = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("이미지 파일만 업로드할 수 있습니다.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("파일 크기는 5MB까지 업로드할 수 있습니다.");
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                setExtraFields(extraFields => extraFields.map((field) => {
                    return (
                        field.id === id ?
                            {
                                ...field,
                                previewImg: e.target.result,
                                file: file,
                                isThumbnail: extraFields.some(field => field.previewImg != null) ? false : true
                            }
                            : field
                    );

                }))
                setTags(tags => tags.filter(tag => tag.fieldID !== id));
            }
        }
    }
    const handleImgOverlay = (id) => {
        setExtraFields(extraFields => extraFields.map(field => {
            return (
                field.id === id ?
                    {
                        ...field,
                        showOverlay: !field.showOverlay
                    }
                    : field
            );
        }))
    }
    const handleAddTag = (e, fieldID) => {

        if (tags.filter(tag => tag.fieldID === fieldID).length >= 10) {
            alert("상품태그는 사진당 10개까지만 추가할 수 있습니다.");
            return;
        } else {
            const img = e.target.getBoundingClientRect();
            const x = e.clientX - img.left;
            const y = e.clientY - img.top;

            const filedIdx = extraFields.findIndex(field => field.id === fieldID) + 1;

            setTags(tags => [
                ...tags,
                { tagX: x, tagY: y, tagId: Date.now(), fieldID: fieldID, showContent: false, text: "", showModal: true, fieldIdx: filedIdx, dealIdx: 0, nodeRef: React.createRef() }
            ]);
            handleImgOverlay(fieldID);
        }

    }
    const handleTagContent =  (tagId) => {
        setTags(tags.map(tag => {
            if (tag.tagId === tagId) {
                if (tag.showContent) {
                    return { ...tag, showContent: false };
                } else {
                    return { ...tag, showContent: true }
                }
            }
            return { ...tag, showContent: false };
        }));
    };
    const handleTagDelete = (delId) => {
        if (confirm("태그를 삭제하시겠습니까?")) {
            setTags(tags.filter(tag => tag.tagId !== delId));

        }
    }
    const handleTagText = (e, tagId) => {
        setTags(tags.map(tag => {
            return (
                tag.tagId === tagId ?
                    ({ ...tag, text: e.target.value })
                    :
                    (tag)
            );
        }));
    }
    const handleTagModal = (tagId) => {
        setTags(tags.map(tag => {
            return (
                tag.tagId === tagId ?
                    ({ ...tag, showModal: !tag.showModal })
                    :
                    (tag)
            );
        }));
    };

    const handleOpenLinkModal = async () => {
        const apiUrl = `${baseUrl}/camplog/linkmodal/${1}`; // userIdx대신 임시값
        try {
            const response = await axios.get(apiUrl);
            console.log("response: ", response);
            if (response.data.success) {
                const data = response.data.data;
                setLinkList(data.map(data => {
                    return (
                        {
                            ...data,
                            isLinked: false,
                            tagId: ""
                        }
                    )
                }));
                setShowLinkModal(true);
            } else {
                if (response.data.message === "데이터를 불러오는 중에 문제가 발생했습니다.") {
                    alert(response.data.message);
                }
            }
        } catch (error) {
            console.error("error: " + error);
            alert("서버 오류 발생");
        }
    }
    const handleChangeThumbnail = (fieldID) => {
        setExtraFields(extraFields.map(field => {
            return (
                field.id === fieldID ?
                    {
                        ...field,
                        isThumbnail: true
                    }
                    :
                    {
                        ...field,
                        isThumbnail: false
                    }
            );
        }));
    }
    const handleExtraContent = (e, fieldId) => {
        setExtraFields(extraFields.map(field => {
            return (
                field.id === fieldId ?
                    ({ ...field, text: e.target.value })
                    :
                    (field)
            );
        })
        );
    }
    // Rest of the functions from the write page...
    // (Include all the helper functions from the original write page, they remain mostly the same)
    const createNewField = () => {
        if (extraFields.length < 10) {
            setExtraFields([...extraFields, {
                id: Date.now(),
                file: null,
                text: "",
                previewImg: null,
                showOverlay: false,
                isThumbnail: false
            }]);
        } else {
            alert("사진은 최대 10장까지만 넣을 수 있습니다.");
        }
    };

    // ... (Include all other functions from the write page component)

    return (
        <>
            <header>
                <span style={{ fontSize: "70px", display: "inline-block" }}> </span>
                <span style={{ display: "inline-block", fontSize: "50px", marginLeft: "33%" }}>캠핑로그 수정</span>
            </header>
            
            {/* Rest of the JSX remains the same as the write page */}
            {/* Just update the button text from "작성" to "수정" */}
            <Grid2 container spacing={2}>
                {/* ... Same grid layout and components as write page ... */}
                <Button variant="contained" style={{ float: "right" }} onClick={handleUpdate}>수정</Button>
                {/* ... Rest of the components ... */}
            </Grid2>

            {/* Include all the same modals and other components */}
        </>
    );
}

export default EditPage;