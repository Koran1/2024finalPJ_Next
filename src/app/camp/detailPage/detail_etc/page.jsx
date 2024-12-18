'use client'

function Page({ item }) {


    const rows = [
        { id: 1, title: '주요시설', content: `일반야영장(${item.gnrlSiteCo}면), 자동차야영장(${item.autoSiteCo}면)` },
        { id: 2, title: '항목 2', content: '내용 2' },
        { id: 3, title: '항목 3', content: '내용 3' },
        { id: 4, title: '항목 4', content: '내용 4' },
        { id: 5, title: '항목 5', content: '내용 5' },
        { id: 6, title: '항목 6', content: '내용 6' },
        { id: 7, title: '항목 7', content: '내용 7' },
        { id: 8, title: '항목 8', content: '내용 8' },
        { id: 9, title: '항목 9', content: '내용 9' },
    ];
    return (
        <>
            <div className="map-heading">
                <span className="icon">▶</span>
                기타 주요시설
            </div>
            <div className="table-container">
                <table className="custom-table">
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <th>{row.title}</th>
                                <td>{row.content}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Page;