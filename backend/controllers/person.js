
const getPersons = (req, res) => {
    // console.log(arr)
    res.status(200).json({ success: true, data: persons })
}

const addPerson = (req, res) => {
    const { name } = req.body
    if (!name) {
        res.status(401).json({'err':'please provide a name'})
    }
    const myMap = new Map
    res.status(201).send({ success: true, person: [...persons, {'person': name}] })
}

const updatePerson = (req, res)=>{
    const { person } = req.params
    const { name } = req.body
    const per = persons.find(e=>e.person === person)
    if(typeof person === 'undefined'){
        return res.status(401).json({'err':'required field missing'})
    }
    if(!person){
        return res.status(401).json({'err':'required field missing'})
    }
    if(!name){
        return res.status(401).json({'err':'required field missing'})
    }
    if(!per){
        return res.status(404).json({'err':'user not found'})
    }
        per.person = name
        return res.status(200).json({success: true, data: persons})
}

const deletePerson = (req, res)=>{
    const {person} = req.params
    const per = persons.find((e) =>{
        e.person === person
    })
    const newPer = persons.filter(e => e.person !== person)
    return res.status(200).json({success:true, data: newPer})
}

module.exports = { getPersons, addPerson, updatePerson, deletePerson }
