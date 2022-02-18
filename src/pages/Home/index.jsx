import React, { useState, useEffect } from "react";
import "animate.css";
import "./index.css";
import scheduleAPI from "../../api/scheduleAPI";
import profileAPI from "../../api/profileAPI";
import logo from "../../assets/images/sgu-logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBirthdayCake, faUserGraduate, faCertificate, faSchool, faAddressCard } from '@fortawesome/free-solid-svg-icons'
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { dateToIndex, indexToDate } from "../../utils/dateToIndex";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const title = {
    textAlign: 'center'
}

const color = [
    '#f5b419',
    '#2ebaab',
    '#e83149',
    '#33a1fd',
    '#7d7ae4',
    '#44cf6c',
    '#44cf6c',
    '#35d4ad',
    '#979797'
]

function Home() {
    const [start, setStart] = useState(false);
    const [input, setInput] = useState("");
    const [id, setId] = useState("");
    const [schedule, setSchedule] = useState([]);
    const [table, setTable] = useState();
    const [weekLabel, setWeekLabel] = useState("Tuần 1");
    const [weekIndex, setWeekIndex] = useState(0);
    const [message, setMessage] = useState("");
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false)

    const [openModal, setOpenModal] = React.useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleWeekSelect = (index, label) => {
        setWeekIndex(index);
        setWeekLabel(label);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (id !== "") {
            setLoading(true)
            const fetchSchedule = async () => {
                try {
                    const response = await scheduleAPI.getScheduleById(id);
                    if (response.data.length !== 0) {
                        setSchedule(separate(allocateColor(response.data)));
                        setMessage("");
                    } else {
                        setMessage("Không tìm thấy thời khóa biểu");
                    }
                } catch (error) {
                    switch (error.response.data.statusCode) {
                        case '400':
                            setMessage('Mã số sinh viên không hợp lệ');
                            break;
                        case '404':
                            setMessage('Không tìm thấy mã số sinh viên');
                            break;
                        case '500':
                            setMessage('Lỗi máy chủ. Vui lòng load lại trang');
                            break;
                        default:
                            setMessage('Đã có lỗi xảy ra !');
                            break;
                    }
                }
            };
            const fetchProfile = async () => {
                try {
                    const response = await profileAPI.getProfileById(id);
                    if (response.data.length !== 0) {
                        setProfile(response.data)
                        setMessage("");
                    } else {
                        setMessage("Không tìm thấy thời khóa biểu");
                    }
                } catch (error) {
                    console.log("Error");
                }
            };
            fetchSchedule();
            fetchProfile();
        }
    }, [id]);

    function allocateColor(schedule) {
        var newSchedule = []
        schedule.forEach((element, index) => {
            var course = {
                ...element,
                color: color[index]
            }
            newSchedule.push(course);
        })
        return newSchedule;
    }

    function handleSearchChange(event) {
        setInput(event.target.value);
    }

    function clickSearch() {
        setId(input);
    }

    function clickStart() {
        setStart(true);
    }

    function separate(schedule) {
        var lessons = [];

        schedule.forEach((element, index) => {
            const n = element.date.length;

            for (let i = 0; i < n; i++) {
                if (element.week[i].length < 15) {
                    const diff = 15 - element.week[i].length;
                    for (let j = 0; j < diff; j++) {
                        element.week[i] += "-";
                    }
                }
                let lesson = {
                    id: element.id,
                    name: element.name,
                    color: element.color,
                    group: element.group,
                    credits: element.credits,
                    classCode: element.classCode,
                    date: element.date[i],
                    start: element.start[i],
                    room: element.room[i],
                    period: element.period[i],
                    lecturer: element.lecturer[i],
                    week: element.week[i],
                };
                lessons.push(lesson);
            }
        });

        for (let i = 0; i < lessons.length; i++) {
            for (let j = 0; j < lessons.length; j++) {
                if (i !== j) {
                    if (
                        lessons[i].id === lessons[j].id &&
                        lessons[i].date === lessons[j].date &&
                        lessons[i].start === lessons[j].start
                    ) {
                        lessons.splice(j, 1);
                    }
                }
            }
        }

        let weeks = [];

        for (let i = 0; i < 15; i++) {
            let weekSchedule = [];

            lessons.forEach((element) => {
                if (element.week[i] !== "-") {
                    weekSchedule.push(element);
                }
            });

            weeks.push(weekSchedule);
        }
        return weeks;
    }

    useEffect(() => {
        if (schedule.length !== 0) {
            setTable(generateTable(schedule, weekIndex));
        }
        setLoading(false)
    }, [schedule, weekIndex]);

    function cellStyle(color) {
        return {
            backgroundColor: `${color}60`,
            border: `2px solid ${color}`,
            color: `${color}`
        }
    }

    function generateTable(schedule, weekIndex) {
        var newSchedule = schedule[weekIndex].sort((a, b) =>
            a.start < b.start
                ? -1
                : a.start === b.start
                    ? dateToIndex(a.date) < dateToIndex(b.date)
                        ? -1
                        : 1
                    : 1
        );

        let index = 0;
        let rows = [];
        let span = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 13; i++) {
            let cols = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j !== 0) {
                    cols.push(<td className="date">{indexToDate(j)}</td>);
                } else if (j === 0 && i !== 0) {
                    cols.push(<td className="period">Tiết {i}</td>);
                } else if (
                    index < newSchedule.length &&
                    parseInt(newSchedule[index].start, 10) === i &&
                    dateToIndex(newSchedule[index].date) === j
                ) {
                    cols.push(
                        <td className="subject" rowSpan={newSchedule[index].period} style={cellStyle(newSchedule[index].color)}>
                            <div>{newSchedule[index].name}</div>
                            <div>Phòng: {newSchedule[index].room}</div>
                        </td>
                    );
                    span[j] += newSchedule[index].period - 1;
                    index++;
                } else {
                    if (span[j] > 0) {
                        span[j] -= 1;
                    } else {
                        cols.push(<td></td>);
                    }
                }
            }
            rows.push(<tr>{cols}</tr>);
        }

        return <table>{rows}</table>;
    }

    function handleReturn(e) {
        setId("")
    }

    return (

        <div className="home">
            <div className="home__container animate__animated animate__fadeIn animate__delay-0.5s">
                {!(id && schedule.length !== 0) && (
                    <div className="home__inner">
                        <div>
                            <img className="home__logo" alt="logo" src={logo} />
                        </div>
                        <div className="home__title">
                            <p>Thời khóa biểu sinh viên</p>
                        </div>
                        <div className="home__textfield">
                            {!start && (
                                <div className="animate__animated animate__fadeInDown animate__delay-1s">
                                    <Button variant="contained" onClick={clickStart}>
                                        Bắt đầu
                                    </Button>
                                </div>
                            )}
                            {start && (
                                <div className="home__textfield">
                                    <TextField
                                        fullWidth={true}
                                        id="outlined-basic"
                                        label="Mã số sinh viên"
                                        variant="outlined"
                                        onChange={handleSearchChange}
                                        placeholder="3118320001"
                                    />
                                    <div className="message">{message}</div>
                                    <Button
                                        className="home__search__btn"
                                        variant="contained"
                                        onClick={clickSearch}
                                    >
                                        Tra cứu
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="home__inner">
                    {id && schedule.length !== 0 && (
                        <div>
                            <div className="schedule__controller">
                                <div>
                                    <span>Tên: </span>
                                    <Button onClick={handleOpenModal}>{profile.name}</Button>
                                    <Modal
                                        open={openModal}
                                        onClose={handleCloseModal}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography sx={title} id="modal-modal-title" variant="h4" component="h2">
                                                Thông tin sinh viên
                                            </Typography>
                                            <div className="line"><span><FontAwesomeIcon icon={faUserGraduate} color={'#979797'} /></span> Tên: <span>{profile.name}</span></div>
                                            <div className="line"><span><FontAwesomeIcon icon={faAddressCard} color={'#979797'} /></span> MSSV: <span>{profile.id}</span></div>
                                            <div className="line"><span><FontAwesomeIcon icon={faAddressCard} color={'#979797'} /></span> Lớp: <span>{profile.grade}</span></div>
                                            <div className="line"><span><FontAwesomeIcon icon={faBirthdayCake} color={'#979797'} /></span> Ngày sinh: <span>{profile.dob}</span></div>
                                            <div className="line falcuty">
                                                <div className="column"><span><FontAwesomeIcon icon={faCertificate} color={'#979797'} /></span> Ngành: <span>{profile.major}</span></div>
                                                <div className="column"><span><FontAwesomeIcon icon={faSchool} color={'#979797'} /></span> Khoa: <span>{profile.falcuty}</span></div>
                                            </div>
                                        </Box>
                                    </Modal>
                                </div>
                                <div>
                                    <span>Chọn </span>
                                    <Button
                                        id="basic-button"
                                        variant="contained"
                                        aria-controls="basic-menu"
                                        aria-haspopup="true"
                                        aria-expanded={open ? "true" : undefined}
                                        onClick={handleClick}
                                    >
                                        {weekLabel}
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            "aria-labelledby": "basic-button",
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(0, "Tuần 1");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 1
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(1, "Tuần 2");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 2
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(2, "Tuần 3");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 3
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(3, "Tuần 4");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 4
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(4, "Tuần 5");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 5
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(5, "Tuần 6");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 6
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(6, "Tuần 7");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 7
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(7, "Tuần 8");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 8
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(8, "Tuần 9");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 9
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(9, "Tuần 10");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 10
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(10, "Tuần 11");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 11
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(11, "Tuần 12");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 12
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(12, "Tuần 13");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 13
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(13, "Tuần 14");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 14
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleWeekSelect(14, "Tuần 15");
                                                handleClose();
                                            }}
                                        >
                                            Tuần 15
                                        </MenuItem>
                                    </Menu>
                                </div>
                                <div>
                                    <Button variant="contained" color="error" onClick={handleReturn}>
                                        Quay lại
                                    </Button>
                                </div>
                            </div>

                            <div>{table}</div>
                        </div>
                    )}
                </div>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default Home;
