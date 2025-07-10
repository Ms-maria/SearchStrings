import { useState } from 'react';
import axios from 'axios';
import ResultsTable from './ResultsTable';
import './SearchForm.css';

const SearchForm = () => {
  const [searchData, setSearchData] = useState({
    field1: '',
    field2: '',
    field3: ''
  });

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setSearchData({ field1: '', field2: '', field3: '' });
    setResults([]);
    setError(null);
  };

  const handleSearch = async () => {
    const params = {};
    if (searchData.field1.trim()) params.field1 = searchData.field1.trim();
    if (searchData.field2.trim()) params.field2 = searchData.field2.trim();
    if (searchData.field3.trim()) params.field3 = searchData.field3.trim();

    if (Object.keys(params).length === 0) {
      setError("Заполните хотя бы одно поле!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
        const response = await axios.post('http://localhost:8000/api/search', params);
        setResults(response.data.results);} 
    catch (error) {
      console.error("Ошибка поиска:", error);
      setError(error.response?.data?.message || error.message || "Ошибка при выполнении поиска");} 
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1>Поиск</h1>
      
      <div className="input-group">
        <input
          type="text"
          name="field1"
          value={searchData.field1}
          onChange={handleInputChange}
          placeholder="Поле 1"
        />
        <input
          type="text"
          name="field2"
          value={searchData.field2}
          onChange={handleInputChange}
          placeholder="Поле 2"
        />
        <input
          type="text"
          name="field3"
          value={searchData.field3}
          onChange={handleInputChange}
          placeholder="Поле 3"
        />
      </div>

      <div className="button-group">
        <button 
          onClick={handleSearch} 
          className="search-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Поиск...' : 'Искать'}
        </button>
        <button 
          onClick={handleClear} 
          className="clear-btn"
          disabled={isLoading}
        >
          Очистить
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <h2>Результаты поиска:</h2>
      
      {isLoading ? (
        <div className="loading-indicator">Загрузка...</div>
      ) : results.length > 0 ? (
        <ResultsTable data={results} />
      ) : (
        <div className="no-results">Нет результатов для отображения</div>
      )}
    </div>
  );
};

export default SearchForm;