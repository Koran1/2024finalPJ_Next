'use client'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import { AddSideBar } from '../../../../components/add/notice/AddSideBar';
import axios from 'axios';

function Page(props) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL

    const [faqs, setFaqs] = useState([]);
    useEffect(() => {
        const data = axios.get(`${LOCAL_API_BASE_URL}/add/faq`)
            .then((res) => {
                console.log(res.data);
                setFaqs(res.data.data);
            })
            .catch((err) => console.log(err))

    }, [])

    return (
        <div>
            <Box display="flex" style={{ marginTop: '100px' }}>
                <AddSideBar />
                <Box flexGrow={1} p={2}>
                    {faqs.map((faq, idx) => {
                        return (
                            <Accordion defaultExpanded={idx == 0} key={faq.faqIdx}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`panel${idx}-content`}
                                    id={`panel${idx}-header`}
                                >
                                    <Typography component="span"
                                        style={{ fontSize: "20px", fontWeight: 'bold' }}>
                                        {faq.faqQuestion}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails style={{ backgroundColor: '#F5F5F5' }}>
                                    {faq.faqAnswer}
                                </AccordionDetails>
                            </Accordion>
                        )
                    })
                    }
                </Box>
            </Box>
        </div>
    );
}

export default Page;