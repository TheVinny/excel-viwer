/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Papa from 'papaparse'
import ToastFyError from './shared/components/ToastFyError'
import ToastFySuccess from './shared/components/ToastFySuccess'
import ToastFyWarning from './shared/components/ToastFyWarning'

function App() {
  const [csvData, setCsvData] = useState<unknown | any>([])
  const [search, setSearch] = useState('')
  const [listRA, setListRa] = useState([''])
  const [filtred, setFiltered] = useState<unknown | any>([])
  const [missingRA, setMissingRA] = useState<string[]>([])

  const handleFileUpload = ({ files }: EventTarget & HTMLInputElement) => {
    if (!files) return null

    const file = files[0]

    if (!file.type.includes('csv')) {
      return ToastFyError('Extensão de arquivo inesperado utilize arquivos CSV')
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        result.data.pop()

        result.data.map((item: any) => {
          return (item.Matrícula = item.Matrícula.toString())
        })
        setCsvData(result.data)

        ToastFySuccess('Tabela CSV importada com sucesso')
      },
      error: (error) => {
        console.error('Error parsing CSV:', error.message)
      },
    })
  }

  function handleValidInput(search: string, csvData: any[]) {
    const regex = /^(\d{8}-)*\d{8}$/

    const arrayMatriculas = search
      .split('-')
      .map((matricula) => matricula.trim())

    setListRa(arrayMatriculas)

    const registrosFiltrados = csvData.filter((item: any) => {
      return arrayMatriculas.includes(item.Matrícula)
    })

    setFiltered(registrosFiltrados)

    const foundRA = registrosFiltrados.map((item) => item.Matrícula)
    const notFoundRA = arrayMatriculas.filter((ra) => !foundRA.includes(ra))

    setMissingRA(notFoundRA)

    if (notFoundRA.length > 0 && regex.test(search)) {
      const lastInvalidRA = notFoundRA[notFoundRA.length - 1]
      const errorMessage = `RA(s) não encontrado(s): ${notFoundRA.join(', ')}`

      if (arrayMatriculas[arrayMatriculas.length - 1] === lastInvalidRA) {
        ToastFyWarning(`Não foi encontrado o RA ${lastInvalidRA}`)
      }
    }
  }

  useEffect(() => {
    handleValidInput(search, csvData)
  }, [search, csvData]) // Include csvData in the dependencies array

  return (
    <div className="App">
      <ToastContainer />
      <div className="Form">
        <div className="InputBox">
          <input
            type="search"
            id="Search"
            placeholder="Digite o número de matricula no formato a seguir: 96013345-96015567"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
          />
        </div>

        <div className="InputBox">
          <input
            type="file"
            id="Upload"
            onChange={({ target }) => handleFileUpload(target)}
            accept="csv"
          />
        </div>
      </div>

      <div className="content">
        <DataTable
          value={search ? filtred : csvData}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20]}
          tableStyle={{
            minWidth: '50rem',
            borderCollapse: 'collapse',
            borderSpacing: 10,
          }}
          style={{
            color: 'black',
            backgroundColor: '#fff',
            borderRadius: 10,
            marginBottom: 50,
            border: '1px solid black',
            width: '80%',
            borderCollapse: 'collapse',
            borderSpacing: 10,
          }}
        >
          <Column
            field="Matrícula"
            header="Matrícula"
            style={{ width: '10%' }}
          ></Column>
          <Column field="Nome" header="Nome" style={{ width: '25%' }}></Column>
          <Column
            field="Departamento"
            header="Departamento"
            style={{
              width: '45%',
              height: 30,
              padding: 10,
              margin: 10,
            }}
          ></Column>
          <Column
            field="Nome do Cargo"
            header="Nome do Cargo"
            style={{ width: '45%' }}
          ></Column>
        </DataTable>
      </div>
    </div>
  )
}

export default App
