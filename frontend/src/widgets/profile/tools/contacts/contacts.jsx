import {useEffect, useState} from "react";
import {CreateContact, DeleteContact, EditContact, GetAllContacts} from "../../../../api/other.jsx";

export default function Contacts() {
    const [totalContacts, setTotalContacts] = useState(null)
    const [toEdit, setToEdit] = useState(null)
    const [createData, setCreateData] = useState({
        title: "",
        contacts: ""
    })

    const setContacts = async () => {
        const contacts = await GetAllContacts()
        setTotalContacts(contacts)
    }

    useEffect(() => {
        setContacts()
    }, [])

    const createContact = async (e) => {
        e.preventDefault()
        await CreateContact(createData)
        await setContacts()
        setCreateData({
            title: "",
            contacts: ""
        })
    }

    const DeleteContactAndSet = async (id) => {
        await DeleteContact(id)
        await setContacts()
    }

    const EditContactAndSet = async(e) => {
        e.preventDefault()
        await EditContact(toEdit)
        await setContacts()
        setToEdit(null)
    }


    return (
        <div className=" bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Раздел "Контакты"</h1>
                    <p className="mt-2 text-gray-600">Управление контентом страницы "Контакты"</p>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Текущие контакты</h2>
                        </div>

                        <div className="p-2">

                            {
                                totalContacts !== null
                                    ?
                                    totalContacts.map((contact, index) => (
                                        <a key={index}
                                           className='w-full flex justify-between items-center transition-all hover:bg-gray-50 p-2'>
                                            <p>{contact.title} - {contact.contacts}</p>


                                            <div className='flex items-center justify-between w-[50px] transition-all hover:bg-gray-50 p-2'>

                                                <svg
                                                    onClick={()=>setToEdit(contact)}
                                                    className='transition hover:scale-120 cursor-pointer' width="15px" height="15px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

                                                <p
                                                    onClick={() => {
                                                        DeleteContactAndSet(contact.id)
                                                    }}
                                                    className='text-gray-300 transition hover:text-red-400 cursor-pointer hover:scale-110'>
                                                    х
                                                </p>
                                            </div>
                                        </a>
                                    ))
                                    :
                                    <div className='flex justify-center items-center font-bold h-[200px]'>
                                        Список контактов пуст :(
                                    </div>
                            }

                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {
                                    (toEdit === null)
                                        ?
                                            "Добавить"
                                        :
                                            "Изменить"

                                }

                            </h2>

                            {
                                (toEdit === null)
                                    ?
                                    <p className="mt-1 text-sm text-gray-500">
                                        Добавить новый контакст в раздел "Контакты"
                                    </p>
                                    : ""
                            }

                        </div>

                        <form onSubmit={(toEdit === null) ? createContact : EditContactAndSet} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Заголовок
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={(toEdit === null) ? createData.title : toEdit.title}
                                    onChange={(e) => {
                                        (toEdit === null)
                                            ?
                                                setCreateData({...createData, title: e.target.value})
                                            :
                                                setToEdit({...toEdit, title: e.target.value});

                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Введите заголовок"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Описание
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={(toEdit === null) ? createData.contacts : toEdit.contacts}
                                    onChange={(e) => {
                                        (toEdit === null)
                                            ?
                                            setCreateData({...createData, contacts: e.target.value})
                                            :
                                            setToEdit({...toEdit, contacts: e.target.value});

                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Введите заголовок"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}