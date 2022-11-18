import { React, useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import "./Deck.css";

const api_base = 'https://deckofcardsapi.com/api/deck/'

const Deck = () => {
    let [deck, setDeck] = useState(null)
    let [drawn, setDrawn] = useState([])
    let [draw, setDraw] = useState(false)
    let timer = useRef(null)
    useEffect(() => {
        async function create_deck() {
            const d = await axios.get(`${api_base}new/shuffle`)
            setDeck(d.data)
        }
        create_deck();
    },
        [setDeck]
    )

    useEffect(() => {
        async function getCard() {
            const { deck_id } = deck

            let c = await axios.get(`${api_base}/${deck_id}/draw/`)
            if (c.data.remaining === 0) {
                setDraw(false);
                throw new Error("no cards remaining!");
            }

            let card = c.data.cards[0]

            setDrawn(d => [
                ...d,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image
                }])



        }
        if (draw && !timer.current) {
            timer.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timer.current)
            timer.current = null
        }
    }, [deck, setDraw, draw])

    function handleClick() {
        setDraw(d => !d)
        console.log(draw, drawn, timer.current)
    }


    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ))
    return (
        <div className="Deck">
            <button className="Deck-gimme" onClick={handleClick}>Click</button>
            <div className="Deck-cardarea">{cards}</div>
        </div>
    )
}

export default Deck;