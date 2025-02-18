import PropTypes from 'prop-types'

function Feed_Card({ children, reverse }) {
  // return <div className={`card ${reverse && 'reverse'}`}>{children}</div>

  return (
    <div
      className='feed_card'
      style={{
        backgroundColor: reverse ? 'rgba(0,0,0,0.4)' : '#acc0d4f2',
        color: reverse ? '#fff' : '#000',
      }}
    >
      {children}
    </div>
  )
}

Feed_Card.defaultProps = {
  reverse: false,
}

Feed_Card.propTypes = {
  children: PropTypes.node.isRequired,
  reverse: PropTypes.bool,
}

export default Feed_Card
