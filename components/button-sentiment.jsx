'use client';

export default function ButtonSentiment() {
    const handleClick = async () => {
        try {
            const response = await fetch('/api/sentiment', { next: { revalidate: 0 }});
            if (response.ok) {
                alert('Sentiment added');
                window.location.reload();
            } else {
                console.error('API request failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleClick} type="button" className="btn btn-primary btn-sm mx-2">
            Evaluate (2)
        </button>
    );
}
