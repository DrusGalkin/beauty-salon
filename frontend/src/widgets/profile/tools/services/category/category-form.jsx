import {useEffect, useState} from "react";
import {CreateCategory, DeleteCategories, FindAllCategories, UpdateCategories} from "../../../../../api/catrgorys.jsx";
import {DeleteReviews} from "../../../../../api/reviews.jsx";

export default function CategoryForm({serviceData, setServiceData, Edit, setEdit}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [categoryInButton, setCategoryInButton] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [objEdit, setObjEdit] = useState({});
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);


    const fetchCategories = async () => {
        try {
            const res = await FindAllCategories();
            setCategories(res);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(objEdit);
            if (isEdit) {
                await UpdateCategories(objEdit.id, objEdit.title);
                setIsEdit(false);
                setObjEdit({})
                fetchCategories();
            } else {
                await CreateCategory(category);
                setIsCreate(false);
                setCategory("");
                fetchCategories();
            }

        } catch (error) {
            console.error("Error creating category:", error);
        }
    }

    const handleCategorySelect = (item) => {
        (Edit !== null) ? setEdit({...Edit, category_id: item.id}) : setServiceData({
            ...serviceData,
            category_id: item.id
        })

        setCategoryInButton(item.title)
        setIsOpen(false);
    }

    useEffect(() => {
        if (Edit && Edit.category_id && categories.length > 0) {
            const selectedCategory = categories.find(item => item.id === Edit.category_id);
            if (selectedCategory) {
                setCategoryInButton(selectedCategory.title);
            }
        }
    }, [Edit, categories]);

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>

                {
                    (categoryInButton !== null) ? "Категория - " + categoryInButton : "Выбрать категорию *"
                }
            </div>

            {
                isOpen && (
                    <div
                        className='flex-col flex shadow-lg border-2 border-gray-100 rounded-2xl p-2 absolute z-50 w-full bg-white'>
                        <div className="relative flex items-center justify-between">
                            <p>
                                {isCreate ? "Создать" : "Каталог:"}
                            </p>

                            <svg
                                onClick={() =>{
                                    setIsCreate(!isCreate)
                                    setIsEdit(false)
                                }}
                                className={
                                    !isCreate
                                        ? "w-5 h-5 mr-2 hover:text-green-600 cursor-pointer transition-all hover:scale-110"
                                        : "w-5 h-5 mr-2 text-green-600 cursor-pointer transition-all scale-110"
                                }
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                        </div>

                        <hr className='border-none bg-gray-300 h-[1px]'/>

                        <div>
                            {
                                isEdit && (
                                    <div className='p-2 flex justify-between gap-2'>
                                        <input
                                            value={objEdit.title}
                                            onChange={e => setObjEdit({...objEdit, title: e.target.value})}
                                            className="px-4 py-3 border w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                            placeholder="Новое название категории"
                                            required
                                            type="text"/>
                                        <button
                                            onClick={handleSubmit}
                                            className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                                            Изменить
                                        </button>
                                    </div>
                                )
                            }

                            {
                                isCreate &&
                                (
                                    <div className='p-2 flex justify-between gap-2'>
                                        <input
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            className="px-4 py-3 border w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                            placeholder="Название новой категории"
                                            required
                                            type="text"/>
                                        <button
                                            onClick={handleSubmit}
                                            className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                                            Создать
                                        </button>
                                    </div>
                                )
                            }

                            {
                                (!isEdit && !isCreate) && (
                                    categories && categories.length > 0
                                        ? categories.map((item, index) => {

                                            return (
                                                <div
                                                    key={index}
                                                    className="p-2 hover:bg-gray-100 flex w-full justify-between cursor-pointer rounded-lg transition-colors"
                                                >
                                                    <div className="w-full max-w-[400px] transition-all hover:text-blue-600"
                                                         onClick={() => handleCategorySelect(item)}>
                                                        {item.title}
                                                    </div>


                                                    <div className="flex justify-between">
                                                        <svg
                                                            onClick={() => {
                                                                setIsEdit(!isEdit)
                                                                setObjEdit(item)
                                                            }
                                                            }
                                                            className="w-5 h-5 text-gray-600 hover:text-green-500 transition-colors duration-200 cursor-pointer"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                            />
                                                        </svg>

                                                        <svg
                                                            onClick={async () => {
                                                                await DeleteCategories(item.id)
                                                                await fetchCategories()
                                                            }}
                                                            className="w-5 ml-5 h-5 text-gray-500 hover:text-red-500 transition-colors"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M19 5L5 19M5 5L19 19"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        : (
                                            <div className='p-2'>
                                                Нет категорий
                                            </div>
                                        )
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}