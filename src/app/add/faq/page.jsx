'use client'
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import { AddSideBar } from '../../../../components/add/notice/AddSideBar';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';
import './faq.css';

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL

    const [faqs, setFaqs] = useState([]);
    useEffect(() => {
        axios.get(`${LOCAL_API_BASE_URL}/add/faq`)
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
                    <div className='faq-font'>
                        {faqs.map((faq, idx) => {
                            return (
                                <Accordion defaultExpanded={idx == 0} key={faq.faqIdx}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${idx}-content`}
                                        id={`panel${idx}-header`}
                                    >
                                        <Typography component="span"
                                            className='faq-title'
                                        >
                                            {faq.faqQuestion}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails style={{ fontSize: "15px", backgroundColor: '#F5F5F5' }}>
                                        {faq.faqAnswer}
                                    </AccordionDetails>
                                </Accordion>
                            )
                        })
                        }
                    </div>
                </Box>
            </Box>
        </div>
    );
}

export default Page;